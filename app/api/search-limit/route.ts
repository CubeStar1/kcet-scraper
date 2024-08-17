import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const MAX_SEARCHES = 60;
const RESET_INTERVAL = 4 * 60 * 60; // 4 hours in seconds

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get the user ID from the request body
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Start a transaction
  const { data: client } = await supabase.rpc('begin_transaction');

  try {
    // Get or create the user's search record
    let { data: searchRecord, error: fetchError } = await supabase
      .from('user_searches')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // Record doesn't exist, create a new one
      const { data: newRecord, error: insertError } = await supabase
        .from('user_searches')
        .insert({ user_id: userId })
        .select()
        .single();

      if (insertError) throw insertError;
      searchRecord = newRecord;
    } else if (fetchError) {
      throw fetchError;
    }

    const now = new Date();
    const lastReset = new Date(searchRecord.last_reset);
    const timeSinceReset = (now.getTime() - lastReset.getTime()) / 1000;

    if (timeSinceReset >= RESET_INTERVAL) {
      // Reset the search count
      const { error: resetError } = await supabase
        .from('user_searches')
        .update({ search_count: 1, last_reset: now.toISOString() })
        .eq('user_id', userId);

      if (resetError) throw resetError;

      await supabase.rpc('commit_transaction');
      return NextResponse.json({ remainingSearches: MAX_SEARCHES - 1 });
    } else if (searchRecord.search_count >= MAX_SEARCHES) {
      // Rate limit exceeded
      await supabase.rpc('rollback_transaction');
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    } else {
      // Increment the search count
      const { error: updateError } = await supabase
        .from('user_searches')
        .update({ search_count: searchRecord.search_count + 1 })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      await supabase.rpc('commit_transaction');
      return NextResponse.json({ remainingSearches: MAX_SEARCHES - (searchRecord.search_count + 1) });
    }
  } catch (error) {
    await supabase.rpc('rollback_transaction');
    console.error('Error in search limit check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}