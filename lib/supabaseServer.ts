import { createClient } from '@supabase/supabase-js';

// Essas variáveis SEM "NEXT_PUBLIC_" só existem no servidor (API Routes)
// Nunca são enviadas ao browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias.');
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
