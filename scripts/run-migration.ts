/**
 * Run the reviews migration
 * Usage: npx tsx scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('Running reviews migration...\n');

  // Step 1: Create reviews table
  console.log('1. Creating reviews table...');
  const { error: createError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });

  if (createError) {
    // Table might already exist, try a simple query
    const { error: checkError } = await supabase
      .from('reviews')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.error('Failed to create reviews table:', createError);
      process.exit(1);
    } else {
      console.log('   Reviews table already exists or created successfully');
    }
  } else {
    console.log('   Done');
  }

  // Step 2: Add columns to recipes table
  console.log('2. Adding rating columns to recipes...');

  // Check if columns exist first
  const { data: recipes } = await supabase
    .from('recipes')
    .select('avg_rating, review_count')
    .limit(1);

  if (recipes === null) {
    console.log('   Columns need to be added via Supabase dashboard SQL editor');
    console.log('\n   Run this SQL in your Supabase dashboard:');
    console.log(`
    ALTER TABLE recipes ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1);
    ALTER TABLE recipes ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
    `);
  } else {
    console.log('   Columns already exist');
  }

  console.log('\n3. Creating indexes...');
  console.log('   Run these in Supabase dashboard SQL editor:');
  console.log(`
    CREATE INDEX IF NOT EXISTS idx_reviews_recipe_id ON reviews(recipe_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
  `);

  console.log('\n4. Creating trigger function...');
  console.log('   Run this in Supabase dashboard SQL editor:');
  console.log(`
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

    DROP TRIGGER IF EXISTS trigger_update_recipe_stats ON reviews;
    CREATE TRIGGER trigger_update_recipe_stats
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_recipe_rating_stats();
  `);

  console.log('\nMigration instructions complete!');
  console.log('Please run the SQL statements above in your Supabase dashboard SQL editor.');
}

runMigration().catch(console.error);
