import { NextRequest, NextResponse } from 'next/server';
import { scrapeRecipe } from '@/lib/scraper';

/**
 * POST /api/scrape
 * Manual scrape endpoint for single URL
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

    // Parse request body
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid URL' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Scrape the recipe
    const result = await scrapeRecipe(url);

    if (result.success) {
      return NextResponse.json({
        success: true,
        recipeId: result.recipeId,
        url: result.url,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          url: result.url,
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
