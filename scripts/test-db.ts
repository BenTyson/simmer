/**
 * Test database connection and insert
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDb() {
  console.log('Testing database connection...\n');

  // Check tables
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('count')
    .limit(1);

  if (recipesError) {
    console.error('Error querying recipes:', recipesError);
  } else {
    console.log('✓ recipes table accessible');
  }

  // Try inserting a test recipe
  const testRecipe = {
    slug: 'test-recipe-' + Date.now(),
    name: 'Test Recipe',
    description: 'A test recipe',
    source_url: 'https://example.com/test-' + Date.now(),
    source_domain: 'example.com',
  };

  console.log('\nAttempting to insert test recipe...');
  const { data: insertData, error: insertError } = await supabase
    .from('recipes')
    .insert(testRecipe)
    .select('id, slug')
    .single();

  if (insertError) {
    console.error('Insert error:', insertError.message);
    console.error('Details:', insertError.details);
    console.error('Hint:', insertError.hint);
    console.error('Code:', insertError.code);
  } else {
    console.log('✓ Insert successful:', insertData);

    // Clean up
    await supabase.from('recipes').delete().eq('id', insertData.id);
    console.log('✓ Cleaned up test recipe');
  }

  // Check scrape_queue
  const { data: queue, error: queueError } = await supabase
    .from('scrape_queue')
    .select('url, status')
    .limit(5);

  if (queueError) {
    console.error('Error querying queue:', queueError);
  } else {
    console.log('\nScrape queue sample:');
    queue?.forEach((item) => console.log(`  ${item.status}: ${item.url}`));
  }
}

testDb()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
  });
