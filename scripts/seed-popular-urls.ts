/**
 * Seed script: Add 100+ popular recipe URLs for database scaling
 *
 * Run with: npx tsx scripts/seed-popular-urls.ts
 *
 * These are hand-picked popular recipes known to have good schema.org data.
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Popular recipe URLs organized by domain
const RECIPE_URLS = [
  // === AllRecipes (20 recipes) ===
  'https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/',
  'https://www.allrecipes.com/recipe/24264/cilantro-lime-chicken/',
  'https://www.allrecipes.com/recipe/228285/teriyaki-salmon/',
  'https://www.allrecipes.com/recipe/16354/easy-meatloaf/',
  'https://www.allrecipes.com/recipe/24002/famous-soft-pretzels/',
  'https://www.allrecipes.com/recipe/8941/best-chocolate-chip-cookies/',
  'https://www.allrecipes.com/recipe/213742/miso-salmon/',
  'https://www.allrecipes.com/recipe/229960/shrimp-scampi-with-pasta/',
  'https://www.allrecipes.com/recipe/26317/chicken-tikka-masala/',
  'https://www.allrecipes.com/recipe/246918/thai-peanut-noodles/',
  'https://www.allrecipes.com/recipe/219173/the-best-chicken-pot-pie/',
  'https://www.allrecipes.com/recipe/23439/perfect-pumpkin-pie/',
  'https://www.allrecipes.com/recipe/174271/homemade-mac-and-cheese/',
  'https://www.allrecipes.com/recipe/141069/quick-and-easy-pad-thai/',
  'https://www.allrecipes.com/recipe/244716/shiitake-fried-rice/',
  'https://www.allrecipes.com/recipe/232342/chef-johns-shakshuka/',
  'https://www.allrecipes.com/recipe/73303/mexican-rice-iii/',
  'https://www.allrecipes.com/recipe/17167/spinach-artichoke-dip/',
  'https://www.allrecipes.com/recipe/45396/easy-garlic-knots/',
  'https://www.allrecipes.com/recipe/17481/simple-white-cake/',

  // === Serious Eats (15 recipes) ===
  'https://www.seriouseats.com/the-best-slow-cooked-bolognese-sauce-recipe',
  'https://www.seriouseats.com/pan-seared-salmon-recipe',
  'https://www.seriouseats.com/the-food-lab-best-chocolate-chip-cookie-recipe',
  'https://www.seriouseats.com/crispy-pan-fried-pork-chops-recipe',
  'https://www.seriouseats.com/reverse-seared-steak-recipe',
  'https://www.seriouseats.com/the-best-roast-chicken-recipe',
  'https://www.seriouseats.com/easy-creamy-mushroom-pasta-recipe',
  'https://www.seriouseats.com/classic-lasagna-recipe',
  'https://www.seriouseats.com/cacio-e-pepe-recipe',
  'https://www.seriouseats.com/beef-stew-recipe',
  'https://www.seriouseats.com/smash-burger-recipe',
  'https://www.seriouseats.com/butter-chicken-recipe',
  'https://www.seriouseats.com/carbonara-recipe',
  'https://www.seriouseats.com/crispy-oven-fries-recipe',
  'https://www.seriouseats.com/new-york-style-pizza-recipe',

  // === Budget Bytes (15 recipes) ===
  'https://www.budgetbytes.com/one-pot-creamy-cajun-chicken-pasta/',
  'https://www.budgetbytes.com/slow-cooker-chicken-noodle-soup/',
  'https://www.budgetbytes.com/dragon-noodles/',
  'https://www.budgetbytes.com/beef-and-cabbage-stir-fry/',
  'https://www.budgetbytes.com/creamy-spinach-tomato-pasta/',
  'https://www.budgetbytes.com/honey-garlic-chicken/',
  'https://www.budgetbytes.com/baked-chicken-fajitas/',
  'https://www.budgetbytes.com/garlic-noodles/',
  'https://www.budgetbytes.com/one-pot-pasta-veggie-soup/',
  'https://www.budgetbytes.com/italian-sausage-and-white-bean-skillet/',
  'https://www.budgetbytes.com/easy-teriyaki-chicken/',
  'https://www.budgetbytes.com/southwest-chicken-skillet/',
  'https://www.budgetbytes.com/coconut-curry-ramen/',
  'https://www.budgetbytes.com/black-bean-quesadillas/',
  'https://www.budgetbytes.com/sesame-noodles/',

  // === Cookie and Kate (12 recipes) ===
  'https://cookieandkate.com/best-banana-bread-recipe/',
  'https://cookieandkate.com/best-lentil-soup-recipe/',
  'https://cookieandkate.com/easy-black-bean-soup-recipe/',
  'https://cookieandkate.com/peanut-butter-cookies-recipe/',
  'https://cookieandkate.com/vegetable-fried-rice-recipe/',
  'https://cookieandkate.com/roasted-broccoli-recipe/',
  'https://cookieandkate.com/best-guacamole-recipe/',
  'https://cookieandkate.com/vegetarian-chili-recipe/',
  'https://cookieandkate.com/quinoa-salad-recipe/',
  'https://cookieandkate.com/sweet-potato-black-bean-tacos/',
  'https://cookieandkate.com/best-hummus-recipe/',
  'https://cookieandkate.com/fresh-tomato-pasta-recipe/',

  // === Minimalist Baker (10 recipes) ===
  'https://minimalistbaker.com/the-best-vegan-gluten-free-pancakes/',
  'https://minimalistbaker.com/1-bowl-chocolate-chip-banana-bread/',
  'https://minimalistbaker.com/best-vegan-mac-and-cheese/',
  'https://minimalistbaker.com/best-damn-vegan-meatballs/',
  'https://minimalistbaker.com/thai-peanut-sauce/',
  'https://minimalistbaker.com/vegan-gluten-free-brownies/',
  'https://minimalistbaker.com/easy-baked-falafel/',
  'https://minimalistbaker.com/instant-pot-vegetable-soup/',
  'https://minimalistbaker.com/vegan-pesto-recipe/',
  'https://minimalistbaker.com/coconut-curry-ramen/',

  // === King Arthur Baking (10 recipes) ===
  'https://www.kingarthurbaking.com/recipes/classic-birthday-cake-recipe',
  'https://www.kingarthurbaking.com/recipes/no-knead-crusty-white-bread-recipe',
  'https://www.kingarthurbaking.com/recipes/chocolate-chip-cookies-recipe',
  'https://www.kingarthurbaking.com/recipes/blueberry-muffins-recipe',
  'https://www.kingarthurbaking.com/recipes/cinnamon-rolls-recipe',
  'https://www.kingarthurbaking.com/recipes/banana-bread-recipe',
  'https://www.kingarthurbaking.com/recipes/sourdough-bread-recipe',
  'https://www.kingarthurbaking.com/recipes/fudge-brownies-recipe',
  'https://www.kingarthurbaking.com/recipes/pumpkin-bread-recipe',
  'https://www.kingarthurbaking.com/recipes/pizza-dough-recipe',

  // === Skinnytaste (10 recipes) ===
  'https://www.skinnytaste.com/air-fryer-chicken-breast/',
  'https://www.skinnytaste.com/zucchini-noodles-with-turkey-meatballs/',
  'https://www.skinnytaste.com/instant-pot-chicken-and-rice/',
  'https://www.skinnytaste.com/baked-salmon-with-garlic-and-dijon/',
  'https://www.skinnytaste.com/crock-pot-chicken-taco-chili/',
  'https://www.skinnytaste.com/air-fryer-salmon/',
  'https://www.skinnytaste.com/shrimp-stir-fry-with-coconut-curry/',
  'https://www.skinnytaste.com/turkey-taco-lettuce-wraps/',
  'https://www.skinnytaste.com/asian-chicken-lettuce-wraps/',
  'https://www.skinnytaste.com/crock-pot-santa-fe-chicken/',

  // === Simply Recipes (10 recipes) ===
  'https://www.simplyrecipes.com/recipes/homemade_pizza/',
  'https://www.simplyrecipes.com/recipes/banana_bread/',
  'https://www.simplyrecipes.com/recipes/perfect_roast_chicken/',
  'https://www.simplyrecipes.com/recipes/meatloaf/',
  'https://www.simplyrecipes.com/recipes/spaghetti_carbonara/',
  'https://www.simplyrecipes.com/recipes/french_toast/',
  'https://www.simplyrecipes.com/recipes/chicken_noodle_soup/',
  'https://www.simplyrecipes.com/recipes/beef_stew/',
  'https://www.simplyrecipes.com/recipes/guacamole/',
  'https://www.simplyrecipes.com/recipes/chicken_parmesan/',

  // === BBC Good Food (8 recipes) ===
  'https://www.bbcgoodfood.com/recipes/best-ever-chocolate-brownies-recipe',
  'https://www.bbcgoodfood.com/recipes/classic-lasagne',
  'https://www.bbcgoodfood.com/recipes/easy-chicken-curry',
  'https://www.bbcgoodfood.com/recipes/beef-stroganoff',
  'https://www.bbcgoodfood.com/recipes/classic-victoria-sandwich-recipe',
  'https://www.bbcgoodfood.com/recipes/spaghetti-bolognese-recipe',
  'https://www.bbcgoodfood.com/recipes/butter-chicken',
  'https://www.bbcgoodfood.com/recipes/easy-pancakes',

  // === Epicurious (5 recipes) ===
  'https://www.epicurious.com/recipes/food/views/ba-syn-roast-chicken-2022',
  'https://www.epicurious.com/recipes/food/views/perfect-pan-seared-steak',
  'https://www.epicurious.com/recipes/food/views/classic-beef-tacos',
  'https://www.epicurious.com/recipes/food/views/basic-creamy-mashed-potatoes',
  'https://www.epicurious.com/recipes/food/views/one-pot-pasta-with-sausage-and-peppers',
];

async function seedPopularUrls() {
  console.log(`Adding ${RECIPE_URLS.length} popular recipe URLs to scrape queue...\n`);

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of RECIPE_URLS) {
    try {
      const domain = new URL(url).hostname.replace(/^www\./, '');

      const { error } = await supabase.from('scrape_queue').upsert(
        {
          url,
          domain,
          status: 'pending',
          priority: 5,
        },
        { onConflict: 'url', ignoreDuplicates: true }
      );

      if (error) {
        if (error.message.includes('duplicate') || error.code === '23505') {
          skipped++;
        } else {
          console.error(`✗ ${url}: ${error.message}`);
          failed++;
        }
      } else {
        process.stdout.write('.');
        added++;
      }
    } catch (err) {
      console.error(`✗ Invalid URL: ${url}`);
      failed++;
    }
  }

  console.log(`\n\nResults:`);
  console.log(`  Added: ${added}`);
  console.log(`  Already existed: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`\nTo scrape these URLs, run:`);
  console.log(`curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://simmer-production.up.railway.app/api/cron/scrape`);
}

seedPopularUrls()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
