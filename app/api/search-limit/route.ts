import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { addHours } from 'date-fns';

const MAX_SEARCHES = 10;
const RESET_INTERVAL = 24; // 4 hours
const SUGGESTION_REWARD = 2;

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get the user ID and action from the request body
  const { userId, action } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
        .insert({ user_id: userId, search_count: 0, last_reset: new Date().toISOString() })
        .select()
        .single();

      if (insertError) throw insertError;
      searchRecord = newRecord;
    } else if (fetchError) {
      throw fetchError;
    }

    const now = new Date();
    const lastReset = new Date(searchRecord.last_reset);
    const timeSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60); // in hours

    if (timeSinceReset >= RESET_INTERVAL) {
      // Reset the search count
      const nextResetTime = addHours(now, RESET_INTERVAL);
      const { error: resetError } = await supabase
        .from('user_searches')
        .update({ search_count: 0, last_reset: now.toISOString() })
        .eq('user_id', userId);

      if (resetError) throw resetError;
      searchRecord.search_count = 0;
    }

    let newSearchCount = searchRecord.search_count;
    let remainingSearches = MAX_SEARCHES - newSearchCount;

    if (action === 'suggestion_reward') {
      // Reward the user for submitting a suggestion
      newSearchCount = Math.max(newSearchCount - SUGGESTION_REWARD, 0);
      remainingSearches = MAX_SEARCHES - newSearchCount;
    } else {
      // Check if the user has exceeded the search limit
      if (remainingSearches <= 0) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded',
          nextResetTime: addHours(lastReset, RESET_INTERVAL).toISOString()
        }, { status: 429 });
      }

      // Increment the search count by 1
      newSearchCount += 1;
      remainingSearches = MAX_SEARCHES - newSearchCount;
    }

    // Update the search count in the database
    const { error: updateError } = await supabase
      .from('user_searches')
      .update({ search_count: newSearchCount })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      remainingSearches,
      nextResetTime: addHours(lastReset, RESET_INTERVAL).toISOString()
    });

  } catch (error) {
    console.error('Error in search limit check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}