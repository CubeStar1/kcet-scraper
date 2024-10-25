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
  const categories = searchParams.get('categories')?.split(',') || [];
  const kcetRank = searchParams.get('kcetRank');
  const round = searchParams.get('round') || 'Mock 1';
  const year = searchParams.get('year') || '2024';

  const rounds = {
    'Mock 1': 'm1',
    'Mock 2': 'm2',
    'Provisional Round 1': 'pr1',
    'Round 1': 'r1',
    'Round 2': 'r2',
    'Round 3': 'r3'
    
  } as { [key: string]: string };

  let query = supabase
    .from(`kcet_${year}_${rounds[round]}_cutoffs`)
    .select('*')
    .order(`${categories[0]}`, { ascending: true });

  // Apply filters
  if (search) {
    query = query.or(`college_name.ilike.%${search}%,branch.ilike.%${search}%,college_code.ilike.%${search}%`);
  }
  if (college && college !== 'All') {
    query = query.eq('college_code', college);
  }
  if (course && course !== 'All') {
    query = query.or(`course_code.ilike.%${course}%`);
  }
  if (kcetRank && categories.length > 0) {
    const rankFilters = categories.map(category => `${category}.gte.${parseInt(kcetRank)}`);
    query = query.or(rankFilters.join(','));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}