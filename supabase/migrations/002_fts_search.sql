-- Simmer Database Schema
-- Migration 002: Full-text search setup

-- =====================================================
-- SEARCH VECTOR FUNCTION
-- Combines name, description, and ingredients into weighted search vector
-- =====================================================

CREATE OR REPLACE FUNCTION build_recipe_search_vector(
    recipe_name VARCHAR,
    recipe_description TEXT,
    recipe_cuisine TEXT[],
    recipe_category TEXT[],
    recipe_id UUID
)
RETURNS TSVECTOR AS $$
DECLARE
    ingredient_text TEXT;
BEGIN
    -- Aggregate all ingredient items for this recipe
    SELECT string_agg(item, ' ')
    INTO ingredient_text
    FROM ingredients
    WHERE recipe_id = build_recipe_search_vector.recipe_id;

    -- Build weighted vector:
    -- A = name (highest weight)
    -- B = description
    -- C = ingredients
    -- D = cuisine/category (lowest weight)
    RETURN (
        setweight(to_tsvector('english', COALESCE(recipe_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(recipe_description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(ingredient_text, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(recipe_cuisine, ' '), '')), 'D') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(recipe_category, ' '), '')), 'D')
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: Update search vector on recipe changes
-- =====================================================

CREATE OR REPLACE FUNCTION update_recipe_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := build_recipe_search_vector(
        NEW.name,
        NEW.description,
        NEW.cuisine,
        NEW.category,
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, cuisine, category
    ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_recipe_search_vector();

-- =====================================================
-- TRIGGER: Update recipe search when ingredients change
-- =====================================================

CREATE OR REPLACE FUNCTION update_recipe_search_on_ingredient_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Trigger search vector rebuild by touching updated_at
    UPDATE recipes
    SET updated_at = NOW()
    WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ingredients_search_update
    AFTER INSERT OR UPDATE OR DELETE ON ingredients
    FOR EACH ROW EXECUTE FUNCTION update_recipe_search_on_ingredient_change();

-- =====================================================
-- GIN INDEX for full-text search
-- =====================================================

CREATE INDEX idx_recipes_search ON recipes USING GIN(search_vector);

-- =====================================================
-- SEARCH FUNCTION
-- Main search function with filters and ranking
-- =====================================================

CREATE OR REPLACE FUNCTION search_recipes(
    search_query TEXT,
    cuisine_filter TEXT[] DEFAULT NULL,
    category_filter TEXT[] DEFAULT NULL,
    diet_filter TEXT[] DEFAULT NULL,
    max_time INTEGER DEFAULT NULL,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    slug VARCHAR,
    name VARCHAR,
    description TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    total_time INTEGER,
    servings INTEGER,
    cuisine TEXT[],
    category TEXT[],
    diet_tags TEXT[],
    source_domain VARCHAR,
    source_name VARCHAR,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.slug,
        r.name,
        r.description,
        r.prep_time,
        r.cook_time,
        r.total_time,
        r.servings,
        r.cuisine,
        r.category,
        r.diet_tags,
        r.source_domain,
        r.source_name,
        ts_rank(r.search_vector, websearch_to_tsquery('english', search_query)) AS rank
    FROM recipes r
    WHERE r.is_deleted = FALSE
        AND r.search_vector @@ websearch_to_tsquery('english', search_query)
        AND (cuisine_filter IS NULL OR r.cuisine && cuisine_filter)
        AND (category_filter IS NULL OR r.category && category_filter)
        AND (diet_filter IS NULL OR r.diet_tags && diet_filter)
        AND (max_time IS NULL OR r.total_time <= max_time)
    ORDER BY rank DESC, r.created_at DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PREFIX SEARCH FUNCTION
-- For autocomplete/suggestions
-- =====================================================

CREATE OR REPLACE FUNCTION search_recipes_prefix(
    prefix TEXT,
    result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    slug VARCHAR,
    name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.slug, r.name
    FROM recipes r
    WHERE r.is_deleted = FALSE
        AND r.name ILIKE prefix || '%'
    ORDER BY r.name
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- BROWSE FUNCTIONS
-- For category/cuisine/diet browsing
-- =====================================================

CREATE OR REPLACE FUNCTION get_recipes_by_category(
    target_category TEXT,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    slug VARCHAR,
    name VARCHAR,
    description TEXT,
    total_time INTEGER,
    servings INTEGER,
    cuisine TEXT[],
    category TEXT[],
    diet_tags TEXT[],
    source_domain VARCHAR,
    source_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.slug,
        r.name,
        r.description,
        r.total_time,
        r.servings,
        r.cuisine,
        r.category,
        r.diet_tags,
        r.source_domain,
        r.source_name
    FROM recipes r
    WHERE r.is_deleted = FALSE
        AND target_category = ANY(r.category)
    ORDER BY r.created_at DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_recipes_by_cuisine(
    target_cuisine TEXT,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    slug VARCHAR,
    name VARCHAR,
    description TEXT,
    total_time INTEGER,
    servings INTEGER,
    cuisine TEXT[],
    category TEXT[],
    diet_tags TEXT[],
    source_domain VARCHAR,
    source_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.slug,
        r.name,
        r.description,
        r.total_time,
        r.servings,
        r.cuisine,
        r.category,
        r.diet_tags,
        r.source_domain,
        r.source_name
    FROM recipes r
    WHERE r.is_deleted = FALSE
        AND target_cuisine = ANY(r.cuisine)
    ORDER BY r.created_at DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_recipes_by_diet(
    target_diet TEXT,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    slug VARCHAR,
    name VARCHAR,
    description TEXT,
    total_time INTEGER,
    servings INTEGER,
    cuisine TEXT[],
    category TEXT[],
    diet_tags TEXT[],
    source_domain VARCHAR,
    source_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.slug,
        r.name,
        r.description,
        r.total_time,
        r.servings,
        r.cuisine,
        r.category,
        r.diet_tags,
        r.source_domain,
        r.source_name
    FROM recipes r
    WHERE r.is_deleted = FALSE
        AND target_diet = ANY(r.diet_tags)
    ORDER BY r.created_at DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;
