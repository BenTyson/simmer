-- Simmer Database Schema
-- Initial migration: Core tables for recipe aggregation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy search

-- =====================================================
-- RECIPES TABLE
-- Core recipe data from schema.org structured data
-- =====================================================
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Core recipe data
    name VARCHAR(500) NOT NULL,
    description TEXT,

    -- Timing (stored in minutes)
    prep_time INTEGER,
    cook_time INTEGER,
    total_time INTEGER,

    -- Servings
    servings INTEGER,
    servings_unit VARCHAR(100), -- "servings", "cookies", "cups"

    -- Categorization (arrays for multi-select)
    cuisine TEXT[] DEFAULT '{}',
    category TEXT[] DEFAULT '{}',
    diet_tags TEXT[] DEFAULT '{}',

    -- Source attribution (CRITICAL for legal compliance)
    source_url TEXT NOT NULL UNIQUE,
    source_domain VARCHAR(255) NOT NULL,
    source_name VARCHAR(255),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_scraped_at TIMESTAMPTZ,
    scrape_version INTEGER DEFAULT 1,

    -- Search optimization
    search_vector TSVECTOR,

    -- Soft delete
    is_deleted BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- INGREDIENTS TABLE
-- Normalized ingredients for better querying
-- =====================================================
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    position INTEGER NOT NULL, -- Order in recipe

    -- Original text from source
    original_text TEXT NOT NULL,

    -- Parsed components
    amount DECIMAL(10, 4),
    amount_max DECIMAL(10, 4), -- For ranges like "3-4 cloves"
    unit VARCHAR(50),
    unit_normalized VARCHAR(50), -- Standardized unit
    item VARCHAR(255),
    preparation VARCHAR(255), -- "minced", "diced", etc.

    -- For affiliate linking
    affiliate_category VARCHAR(100), -- "produce", "dairy", "pantry"

    CONSTRAINT unique_recipe_position UNIQUE (recipe_id, position)
);

-- =====================================================
-- INSTRUCTIONS TABLE
-- Step-by-step cooking instructions
-- =====================================================
CREATE TABLE instructions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    text TEXT NOT NULL,

    CONSTRAINT unique_recipe_step UNIQUE (recipe_id, step_number)
);

-- =====================================================
-- NUTRITION TABLE
-- Optional nutritional information
-- =====================================================
CREATE TABLE nutrition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID UNIQUE NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,

    calories INTEGER,
    fat_grams DECIMAL(8, 2),
    saturated_fat_grams DECIMAL(8, 2),
    carbs_grams DECIMAL(8, 2),
    fiber_grams DECIMAL(8, 2),
    sugar_grams DECIMAL(8, 2),
    protein_grams DECIMAL(8, 2),
    sodium_mg DECIMAL(8, 2),
    cholesterol_mg DECIMAL(8, 2),

    serving_size VARCHAR(100),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SCRAPE QUEUE TABLE
-- Background scraping job queue
-- =====================================================
CREATE TABLE scrape_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL,

    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed, skipped
    priority INTEGER DEFAULT 0, -- Higher = process first

    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_error TEXT,

    -- Rate limiting per domain
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- =====================================================
-- SCRAPE DOMAINS TABLE
-- Configuration and stats per domain
-- =====================================================
CREATE TABLE scrape_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain VARCHAR(255) UNIQUE NOT NULL,

    -- Scraping settings
    is_enabled BOOLEAN DEFAULT TRUE,
    rate_limit_seconds INTEGER DEFAULT 5, -- Seconds between requests
    last_scraped_at TIMESTAMPTZ,

    -- robots.txt cache
    robots_txt TEXT,
    robots_txt_fetched_at TIMESTAMPTZ,

    -- Sitemap info
    sitemap_url TEXT,
    sitemap_last_fetched TIMESTAMPTZ,

    -- Statistics
    total_recipes INTEGER DEFAULT 0,
    successful_scrapes INTEGER DEFAULT 0,
    failed_scrapes INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Recipes indexes
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_source_domain ON recipes(source_domain);
CREATE INDEX idx_recipes_cuisine ON recipes USING GIN(cuisine);
CREATE INDEX idx_recipes_category ON recipes USING GIN(category);
CREATE INDEX idx_recipes_diet ON recipes USING GIN(diet_tags);
CREATE INDEX idx_recipes_created ON recipes(created_at DESC);
CREATE INDEX idx_recipes_not_deleted ON recipes(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_recipes_name_trgm ON recipes USING GIN(name gin_trgm_ops);

-- Ingredients indexes
CREATE INDEX idx_ingredients_recipe ON ingredients(recipe_id);
CREATE INDEX idx_ingredients_item ON ingredients(item);

-- Instructions indexes
CREATE INDEX idx_instructions_recipe ON instructions(recipe_id);

-- Scrape queue indexes
CREATE INDEX idx_scrape_queue_status ON scrape_queue(status, scheduled_for);
CREATE INDEX idx_scrape_queue_domain ON scrape_queue(domain);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER scrape_queue_updated_at
    BEFORE UPDATE ON scrape_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER scrape_domains_updated_at
    BEFORE UPDATE ON scrape_domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
