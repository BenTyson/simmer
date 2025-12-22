-- Reviews table for recipe ratings and comments
CREATE TABLE reviews (
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
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Add rating columns to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Trigger to keep updated_at current
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
CREATE TRIGGER trigger_update_recipe_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_recipe_rating_stats();

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- Anyone can insert reviews (anonymous)
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);
