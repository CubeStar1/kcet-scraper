import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const [{ data: courseCodes, error: courseError }, { data: categories, error: categoryError }] = await Promise.all([
      supabase.from('course_codes').select('code'),
      supabase.from('categories').select('category')
    ]);

    if (courseError) throw new Error('Failed to fetch course codes');
    if (categoryError) throw new Error('Failed to fetch categories');

    return NextResponse.json({
      courseCodes: courseCodes.map(item => item.code),
      categories: categories.map(item => item.category)
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}