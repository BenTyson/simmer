import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/db/client';
import { scrapeRecipe } from '@/lib/scraper';

const BATCH_SIZE = 10; // Process up to 10 URLs per cron run

/**
 * POST /api/cron/scrape
 * Process the scrape queue (called by Railway cron every 5 minutes)
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

    // Get pending items from queue, respecting rate limits per domain
    const { data: queueItems, error: fetchError } = await supabase
      .from('scrape_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .lt('attempts', 3)
      .order('priority', { ascending: false })
      .order('scheduled_for', { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error('Failed to fetch queue:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch queue' },
        { status: 500 }
      );
    }

    if (!queueItems || queueItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No items in queue',
        processed: 0,
      });
    }

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as { url: string; error: string }[],
    };

    // Process each item
    for (const item of queueItems) {
      // Mark as processing
      await supabase
        .from('scrape_queue')
        .update({
          status: 'processing',
          attempts: item.attempts + 1,
        })
        .eq('id', item.id);

      results.processed++;

      // Scrape the recipe
      const scrapeResult = await scrapeRecipe(item.url);

      if (scrapeResult.success) {
        // Mark as completed
        await supabase
          .from('scrape_queue')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        // Update domain stats
        await supabase.rpc('increment_domain_success', { domain_name: item.domain });

        results.succeeded++;
      } else {
        // Check if max attempts reached
        const newAttempts = item.attempts + 1;
        const newStatus = newAttempts >= item.max_attempts ? 'failed' : 'pending';

        // Schedule retry with exponential backoff (5min, 15min, 45min)
        const backoffMinutes = Math.pow(3, newAttempts) * 5;
        const scheduledFor = new Date(Date.now() + backoffMinutes * 60 * 1000);

        await supabase
          .from('scrape_queue')
          .update({
            status: newStatus,
            last_error: scrapeResult.error,
            scheduled_for: scheduledFor.toISOString(),
          })
          .eq('id', item.id);

        // Update domain stats
        await supabase.rpc('increment_domain_failure', { domain_name: item.domain });

        results.failed++;
        results.errors.push({
          url: item.url,
          error: scrapeResult.error || 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Cron scrape error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
