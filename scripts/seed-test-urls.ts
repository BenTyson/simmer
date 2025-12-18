/**
 * Seed script: Add specific recipe URLs for testing
 *
 * Run with: npx tsx scripts/seed-test-urls.ts
 *
 * This seeds a small set of known-good recipe URLs for initial testing
 * before enabling full sitemap discovery.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Hand-picked recipe URLs known to have good schema.org data
const TEST_URLS = [
  // AllRecipes
  'https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/',
  'https://www.allrecipes.com/recipe/24264/cilantro-lime-chicken/',
  'https://www.allrecipes.com/recipe/228285/teriyaki-salmon/',

  // Serious Eats
  'https://www.seriouseats.com/the-best-slow-cooked-bolognese-sauce-recipe',
  'https://www.seriouseats.com/pan-seared-salmon-recipe',

  // Budget Bytes
  'https://www.budgetbytes.com/one-pot-creamy-cajun-chicken-pasta/',
  'https://www.budgetbytes.com/slow-cooker-chicken-noodle-soup/',

  // Minimalist Baker
  'https://minimalistbaker.com/the-best-vegan-gluten-free-pancakes/',
  'https://minimalistbaker.com/1-bowl-chocolate-chip-banana-bread/',

  // Skinnytaste
  'https://www.skinnytaste.com/air-fryer-chicken-breast/',
  'https://www.skinnytaste.com/zucchini-noodles-with-turkey-meatballs/',

  // King Arthur Baking
  'https://www.kingarthurbaking.com/recipes/classic-birthday-cake-recipe',
  'https://www.kingarthurbaking.com/recipes/no-knead-crusty-white-bread-recipe',

  // Cookie and Kate
  'https://cookieandkate.com/best-banana-bread-recipe/',
  'https://cookieandkate.com/best-lentil-soup-recipe/',
];

async function seedTestUrls() {
  console.log('Adding test recipe URLs to scrape queue...\n');

  let added = 0;
  let skipped = 0;

  for (const url of TEST_URLS) {
    const domain = new URL(url).hostname.replace(/^www\./, '');

    const { error } = await supabase.from('scrape_queue').upsert(
      {
        url,
        domain,
        status: 'pending',
        priority: 10, // Higher priority for test URLs
      },
      { onConflict: 'url', ignoreDuplicates: true }
    );

    if (error) {
      console.error(`✗ ${url}: ${error.message}`);
      skipped++;
    } else {
      console.log(`✓ ${url}`);
      added++;
    }
  }

  console.log(`\nAdded ${added} URLs, skipped ${skipped} duplicates.`);
  console.log('\nTo scrape these URLs:');
  console.log('curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3388/api/cron/scrape');
}

seedTestUrls()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
