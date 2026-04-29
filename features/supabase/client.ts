import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Eğer URL veya Key yoksa, `null` döndürüp kullanılmamasını veya kontrollü hata fırlatılmasını sağlıyoruz
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client — bypasses RLS, only for server-side API routes
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
