-- Fix ambiguous column reference in build_recipe_search_vector function
-- The parameter name 'recipe_id' conflicts with the column name in ingredients table

CREATE OR REPLACE FUNCTION build_recipe_search_vector(
    p_recipe_name VARCHAR,
    p_recipe_description TEXT,
    p_recipe_cuisine TEXT[],
    p_recipe_category TEXT[],
    p_recipe_id UUID
)
RETURNS TSVECTOR AS $$
DECLARE
    ingredient_text TEXT;
BEGIN
    -- Aggregate all ingredient items for this recipe
    SELECT string_agg(item, ' ')
    INTO ingredient_text
    FROM ingredients
    WHERE ingredients.recipe_id = p_recipe_id;

    -- Build weighted vector:
    -- A = name (highest weight)
    -- B = description
    -- C = ingredients
    -- D = cuisine/category (lowest weight)
    RETURN (
        setweight(to_tsvector('english', COALESCE(p_recipe_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(p_recipe_description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(ingredient_text, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(p_recipe_cuisine, ' '), '')), 'D') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(p_recipe_category, ' '), '')), 'D')
    );
END;
$$ LANGUAGE plpgsql;

-- Update the trigger function to use new parameter names
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
