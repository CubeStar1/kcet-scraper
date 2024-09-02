import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { addHours } from 'date-fns';

const MAX_SEARCHES = 100;
const RESET_INTERVAL = 8; // 8 hours

function convertToNumber(search: string) {
  return parseInt(search, 10);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const search = searchParams.get('search') || '';
  const courseCode = searchParams.get('courseCode') || '';
  const categoryAllotted = searchParams.get('category') || '';
  const userId = searchParams.get('userId') || '';

  const supabase = createSupabaseServer();

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  try {
    // Check search limit
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
      const { error: resetError } = await supabase
        .from('user_searches')
        .update({ search_count: 0, last_reset: now.toISOString() })
        .eq('user_id', userId);

      if (resetError) throw resetError;
      searchRecord.search_count = 0;
    }

    let remainingSearches = MAX_SEARCHES - searchRecord.search_count;

    // Check if the user has exceeded the search limit
    if (remainingSearches <= 0) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded',
        nextResetTime: addHours(lastReset, RESET_INTERVAL).toISOString()
      }, { status: 429 });
    }

    let query = supabase
      .from('kcet_2023_r1_table')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      if (isNaN(convertToNumber(search))) {
        query = query.or(`cet_no.ilike.%${search}%,candidate_name.ilike.%${search}%,course_name.ilike.%${search}%,course_code.ilike.%${search}%`);
      } else {
        query = query.or(`rank.eq.${convertToNumber(search)}`);
      }
    }

    if (courseCode && courseCode !== 'All Courses') {
      query = query.eq('course_code', courseCode);
    }

    if (categoryAllotted && categoryAllotted !== 'All Categories') {
      query = query.eq('category_allotted', categoryAllotted);
    }

    const { data, count, error } = await query
      .range(start, end)
      .order('rank', { ascending: true });

    if (error) {
      throw error;
    }

    // Increment the search count
    const newSearchCount = searchRecord.search_count + 1;
    const { error: updateError } = await supabase
      .from('user_searches')
      .update({ search_count: newSearchCount })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    remainingSearches = MAX_SEARCHES - newSearchCount;

    return NextResponse.json({ 
      data, 
      count, 
      remainingSearches,
      nextResetTime: addHours(lastReset, RESET_INTERVAL).toISOString()
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}