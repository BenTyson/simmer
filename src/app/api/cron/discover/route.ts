import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/db/client';
import { fetchWithRetry, rateLimiter } from '@/lib/scraper';
import * as cheerio from 'cheerio';

/**
 * POST /api/cron/discover
 * Discover new URLs from sitemaps (called daily)
 * Requires CRON_SECRET for authorization
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: 'Server misconfigured: CRON_SECRET not set' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // Get enabled domains with sitemaps
    const { data: domains, error: domainsError } = await supabase
      .from('scrape_domains')
      .select('*')
      .eq('is_enabled', true)
      .not('sitemap_url', 'is', null);

    if (domainsError) {
      console.error('Failed to fetch domains:', domainsError);
      return NextResponse.json(
        { error: 'Failed to fetch domains' },
        { status: 500 }
      );
    }

    if (!domains || domains.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No domains configured for discovery',
        discovered: 0,
      });
    }

    const results = {
      domainsProcessed: 0,
      urlsDiscovered: 0,
      urlsAdded: 0,
      errors: [] as { domain: string; error: string }[],
    };

    for (const domain of domains) {
      try {
        // Rate limit sitemap fetches
        await rateLimiter.throttle(domain.domain);

        // Fetch sitemap
        const sitemapContent = await fetchWithRetry(domain.sitemap_url);

        // Parse URLs from sitemap
        const urls = parseSitemap(sitemapContent);
        results.urlsDiscovered += urls.length;

        // Filter for likely recipe URLs
        const recipeUrls = urls.filter(isLikelyRecipeUrl);

        // Get existing URLs to avoid duplicates
        const { data: existingUrls } = await supabase
          .from('scrape_queue')
          .select('url')
          .in('url', recipeUrls);

        const { data: existingRecipes } = await supabase
          .from('recipes')
          .select('source_url')
          .in('source_url', recipeUrls);

        const existingSet = new Set([
          ...(existingUrls || []).map((u) => u.url),
          ...(existingRecipes || []).map((r) => r.source_url),
        ]);

        // Filter out already known URLs
        const newUrls = recipeUrls.filter((url) => !existingSet.has(url));

        // Add new URLs to queue
        if (newUrls.length > 0) {
          const queueItems = newUrls.map((url) => ({
            url,
            domain: domain.domain,
            status: 'pending',
            priority: 0,
          }));

          // Insert in batches, ignoring conflicts
          const { error: insertError } = await supabase
            .from('scrape_queue')
            .upsert(queueItems, { onConflict: 'url', ignoreDuplicates: true });

          if (insertError) {
            console.error(`Failed to insert URLs for ${domain.domain}:`, insertError);
          } else {
            results.urlsAdded += newUrls.length;
          }
        }

        // Update domain's last sitemap fetch time
        await supabase
          .from('scrape_domains')
          .update({ sitemap_last_fetched: new Date().toISOString() })
          .eq('id', domain.id);

        results.domainsProcessed++;
      } catch (error) {
        results.errors.push({
          domain: domain.domain,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Cron discover error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Parse URLs from XML sitemap
 */
function parseSitemap(content: string): string[] {
  const urls: string[] = [];

  // Try XML sitemap format
  const $ = cheerio.load(content, { xmlMode: true });

  // Standard sitemap
  $('url loc').each((_, el) => {
    const url = $(el).text().trim();
    if (url) urls.push(url);
  });

  // Sitemap index (contains other sitemaps)
  $('sitemap loc').each((_, el) => {
    const url = $(el).text().trim();
    if (url) urls.push(url);
  });

  return urls;
}

/**
 * Check if URL is likely a recipe page
 */
function isLikelyRecipeUrl(url: string): boolean {
  const lower = url.toLowerCase();

  // Common recipe URL patterns
  const recipePatterns = [
    '/recipe/',
    '/recipes/',
    '/receita/',
    '/recette/',
    '/rezept/',
  ];

  // Patterns to exclude
  const excludePatterns = [
    '/category/',
    '/categories/',
    '/tag/',
    '/tags/',
    '/author/',
    '/search/',
    '/page/',
    '/wp-content/',
    '/wp-admin/',
    '.pdf',
    '.jpg',
    '.png',
    '.gif',
  ];

  // Must match a recipe pattern
  const matchesRecipe = recipePatterns.some((p) => lower.includes(p));

  // Must not match an exclude pattern
  const matchesExclude = excludePatterns.some((p) => lower.includes(p));

  return matchesRecipe && !matchesExclude;
}
