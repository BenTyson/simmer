/**
 * Fetch fresh recipe URLs directly from sitemaps
 *
 * Run with: npx tsx scripts/fetch-fresh-urls.ts
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

// Sites with good schema.org data and accessible sitemaps
const SITEMAP_CONFIGS = [
  {
    domain: 'allrecipes.com',
    sitemaps: [
      'https://www.allrecipes.com/sitemap_1.xml',
      'https://www.allrecipes.com/sitemap_2.xml',
    ],
    urlPattern: /\/recipe\/\d+\//,
    limit: 30,
  },
  {
    domain: 'seriouseats.com',
    sitemaps: ['https://www.seriouseats.com/sitemap.xml'],
    urlPattern: /seriouseats\.com\/.*-recipe$/,
    limit: 20,
  },
  {
    domain: 'budgetbytes.com',
    sitemaps: ['https://www.budgetbytes.com/post-sitemap.xml'],
    urlPattern: /budgetbytes\.com\/[^\/]+\/$/,
    limit: 20,
  },
  {
    domain: 'simplyrecipes.com',
    sitemaps: ['https://www.simplyrecipes.com/sitemap_1.xml'],
    urlPattern: /simplyrecipes\.com\/.*recipe/,
    limit: 20,
  },
  {
    domain: 'kingarthurbaking.com',
    sitemaps: ['https://www.kingarthurbaking.com/recipes-sitemap.xml'],
    urlPattern: /kingarthurbaking\.com\/recipes\//,
    limit: 15,
  },
];

async function fetchSitemap(url: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SimmerBot/1.0)',
        'Accept': 'application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return [];
    }

    const text = await response.text();

    // Extract URLs from <loc> tags
    const urls: string[] = [];
    const locMatches = text.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const match of locMatches) {
      urls.push(match[1].trim());
    }

    return urls;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return [];
  }
}

async function main() {
  console.log('Fetching fresh URLs from sitemaps...\n');

  let totalAdded = 0;

  for (const config of SITEMAP_CONFIGS) {
    console.log(`\n=== ${config.domain} ===`);

    let allUrls: string[] = [];

    for (const sitemapUrl of config.sitemaps) {
      console.log(`  Fetching ${sitemapUrl}...`);
      const urls = await fetchSitemap(sitemapUrl);
      console.log(`  Found ${urls.length} URLs`);
      allUrls.push(...urls);
    }

    // Filter for recipe URLs
    const recipeUrls = allUrls.filter(url => config.urlPattern.test(url));
    console.log(`  ${recipeUrls.length} match recipe pattern`);

    // Take limited sample
    const sampled = recipeUrls.slice(0, config.limit);

    // Add to queue
    let added = 0;
    for (const url of sampled) {
      const { error } = await supabase.from('scrape_queue').upsert(
        {
          url,
          domain: config.domain,
          status: 'pending',
          priority: 5,
        },
        { onConflict: 'url', ignoreDuplicates: true }
      );

      if (!error) {
        added++;
        process.stdout.write('.');
      }
    }

    console.log(`\n  Added ${added} URLs`);
    totalAdded += added;

    // Small delay between domains
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n\nTotal added: ${totalAdded} URLs`);
  console.log('\nTo scrape, run:');
  console.log('curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://simmer-production.up.railway.app/api/cron/scrape');
}

main().catch(console.error);
