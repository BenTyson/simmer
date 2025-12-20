import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Check pending count
  const { data: pending } = await supabase
    .from('scrape_queue')
    .select('url, domain')
    .eq('status', 'pending')
    .limit(20);

  console.log('\nPending URLs (' + (pending?.length || 0) + '):');
  pending?.forEach(r => console.log('  ' + r.domain + ': ' + r.url.slice(0, 60) + '...'));

  // Check failed count
  const { data: failed } = await supabase
    .from('scrape_queue')
    .select('url')
    .eq('status', 'failed');

  console.log('\nFailed: ' + (failed?.length || 0));

  // Check completed count
  const { data: completed } = await supabase
    .from('scrape_queue')
    .select('url')
    .eq('status', 'completed');

  console.log('Completed: ' + (completed?.length || 0));

  // Check recipes count
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id')
    .eq('is_deleted', false);

  console.log('Total recipes: ' + (recipes?.length || 0));
}

main();
