import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABAE_ADMIN!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const college = searchParams.get('college');
  const course = searchParams.get('course');
  const district = searchParams.get('district');
  const category = searchParams.get('category');
  const kcetRank = searchParams.get('kcetRank');
  const round = searchParams.get('round');
  const showNewCourses = searchParams.get('showNewCourses') === 'true';

  let query = supabase
    .from('kcet_2022_r3_cutoffs')
    .select('*');

  // Apply filters
  if (search) {
    query = query.or(`college_name.ilike.%${search}%,branch.ilike.%${search}%,college_code.ilike.%${search}%`);
  }
  if (college && college !== 'All') {
    query = query.eq('college_code', college);
  }
  if (course && course !== 'All') {
    query = query.eq('branch', course);
  }
  if (kcetRank && category) {
    query = query.lte(category, parseInt(kcetRank));
  }
  // Add more filters as needed

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}