import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

function convertToNumber(search: string) {
  return parseInt(search, 10);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const search = searchParams.get('search') || '';
  const courseCode = searchParams.get('courseCode') || '';
  const categoryAllotted = searchParams.get('categoryAllotted') || '';

  const supabase = createRouteHandlerClient({ cookies });

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  try {
    let query = supabase
      .from('kcet_2024_m1_table')
      .select('*', { count: 'exact' });

    if (search) {
      if (isNaN(convertToNumber(search))) {
        query = query.or(`cet_no.ilike.%${search}%,candidate_name.ilike.%${search}%,course_name.ilike.%${search}%,course_code.ilike.%${search}%`);
      } else {
        query = query.or(`rank.gte.${convertToNumber(search)}`);
      }
    }

    if (courseCode) {
      if (courseCode === 'All Courses') {
        query = query.eq('course_code', '');
      } else {
        query = query.eq('course_code', courseCode);
      }
    }

    if (categoryAllotted) {
      if (categoryAllotted === 'All Categories') {
        query = query.eq('category_allotted', '');
      } else {
        query = query.eq('category_allotted', categoryAllotted);
      }
    }

    const { data, count, error } = await query
      .range(start, end)
      .order('rank', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data, count });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}