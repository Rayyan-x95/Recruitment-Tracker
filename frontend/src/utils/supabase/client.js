import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vuelgktzltmpxafkiagv.supabase.co";
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_CKtF_wlYm9rcDtBqmreFXg_iX8Fvn7x";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
