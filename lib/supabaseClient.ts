import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase credentials. This is expected during build if not provided, but will fail at runtime.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
