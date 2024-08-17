import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// invalid input syntax for type integer: "%1325%"'

function convertToNumber(search: string) {
  return parseInt(search, 10);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const search = searchParams.get('search') || '';

  const supabase = createRouteHandlerClient({ cookies });

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  try {
    let query = supabase
      .from('kcet_2023_r1_table')
      .select('*', { count: 'exact' });

    if (search) {
      if (isNaN(convertToNumber(search))) {
        query = query.or(`cet_no.ilike.%${search}%,candidate_name.ilike.%${search}%,course_name.ilike.%${search}%,course_code.ilike.%${search}%`);
      } else {
        query = query.or(`rank.eq.${convertToNumber(search)}`);
      }
    }

    const { data, count, error } = await query
      .order('rank', { ascending: true })
      .range(start, end);

    if (error) {
      throw error;
    }

    return NextResponse.json({ data, count });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}