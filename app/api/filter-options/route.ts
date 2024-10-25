import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

const streams = [
  'Engineering', 
  'Medical', 
  'Architecture',  
  'ISMH', 
  'B.Sc Nursing', 'B.Pharm', 'D.Pharm',  
  'Agri(BSc Pract.)', 'BTech(Agri Eng)', 'Agri(Btech. Pract.)', 'Agri(Bsc)',
  'Veter Sci', 'Veter Sci(Pract.)', 
  'Food Sci','Food Sci(Pract.)'
];


export async function GET() {
  const supabase = createSupabaseServer();
  

  try {
    const [{ data: courseCodes, error: courseError }, { data: categories, error: categoryError }] = await Promise.all([
      supabase.from('course_codes').select('code'),
      supabase.from('categories').select('category')
    ]);

    if (courseError) throw new Error('Failed to fetch course codes');
    if (categoryError) throw new Error('Failed to fetch categories');

    return NextResponse.json({
      courseCodes: courseCodes.map(item => item.code),
      categories: categories.map(item => item.category),
      streams: streams
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}