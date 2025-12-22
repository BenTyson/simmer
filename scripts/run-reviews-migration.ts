/**
 * Run the reviews table migration using Supabase Management API
 * Usage: npx tsx scripts/run-reviews-migration.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_PROJECT_ID = 'hrreshxbsmaakqkpygrm';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Missing SUPABASE_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

const SQL = `
-- Reviews table for recipe ratings and comments
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Add rating columns to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Trigger to keep updated_at current
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger function to recalculate avg_rating and review_count
CREATE OR REPLACE FUNCTION update_recipe_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recipes SET
    avg_rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id) AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM reviews WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id) AND is_approved = true)
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update recipe stats on review changes
DROP TRIGGER IF EXISTS trigger_update_recipe_stats ON reviews;
CREATE TRIGGER trigger_update_recipe_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_recipe_rating_stats();

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- Anyone can insert reviews (anonymous)
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);
`;

async function runMigration() {
  console.log('Running reviews migration via Supabase Management API...\n');

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Migration failed:', response.status, error);
    process.exit(1);
  }

  const result = await response.json();
  console.log('Migration completed successfully!');
  console.log('Result:', JSON.stringify(result, null, 2));
}

runMigration().catch(console.error);
