/**
 * Seed script: Initialize scrape_domains table with top recipe sites
 *
 * Run with: npx tsx scripts/seed-domains.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
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

// Top recipe sites from SIMMER.md - Tier 1 (High Quality schema.org)
const SEED_DOMAINS = [
  {
    domain: 'allrecipes.com',
    sitemap_url: 'https://www.allrecipes.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'foodnetwork.com',
    sitemap_url: 'https://www.foodnetwork.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'seriouseats.com',
    sitemap_url: 'https://www.seriouseats.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'bonappetit.com',
    sitemap_url: 'https://www.bonappetit.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'epicurious.com',
    sitemap_url: 'https://www.epicurious.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'bbcgoodfood.com',
    sitemap_url: 'https://www.bbcgoodfood.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'tasteofhome.com',
    sitemap_url: 'https://www.tasteofhome.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  // Tier 2 (Good Coverage)
  {
    domain: 'delish.com',
    sitemap_url: 'https://www.delish.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'simplyrecipes.com',
    sitemap_url: 'https://www.simplyrecipes.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'budgetbytes.com',
    sitemap_url: 'https://www.budgetbytes.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'minimalistbaker.com',
    sitemap_url: 'https://minimalistbaker.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'cookieandkate.com',
    sitemap_url: 'https://cookieandkate.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'smittenkitchen.com',
    sitemap_url: 'https://smittenkitchen.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'thepioneerwoman.com',
    sitemap_url: 'https://www.thepioneerwoman.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  // Tier 3 (Niche/Diet-Specific)
  {
    domain: 'skinnytaste.com',
    sitemap_url: 'https://www.skinnytaste.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'dietdoctor.com',
    sitemap_url: 'https://www.dietdoctor.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'ohsheglows.com',
    sitemap_url: 'https://ohsheglows.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
  {
    domain: 'kingarthurbaking.com',
    sitemap_url: 'https://www.kingarthurbaking.com/sitemap.xml',
    rate_limit_seconds: 5,
  },
];

async function seedDomains() {
  console.log('Seeding scrape_domains table...\n');

  for (const domain of SEED_DOMAINS) {
    const { data, error } = await supabase
      .from('scrape_domains')
      .upsert(
        {
          domain: domain.domain,
          sitemap_url: domain.sitemap_url,
          rate_limit_seconds: domain.rate_limit_seconds,
          is_enabled: true,
        },
        { onConflict: 'domain' }
      )
      .select();

    if (error) {
      console.error(`Failed to insert ${domain.domain}:`, error.message);
    } else {
      console.log(`✓ ${domain.domain}`);
    }
  }

  console.log(`\nSeeded ${SEED_DOMAINS.length} domains.`);
  console.log('\nNext steps:');
  console.log('1. Run discovery: curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3388/api/cron/discover');
  console.log('2. Process queue: curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3388/api/cron/scrape');
}

seedDomains()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
