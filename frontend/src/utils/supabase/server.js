import { createServerClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vuelgktzltmpxafkiagv.supabase.co";
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_CKtF_wlYm9rcDtBqmreFXg_iX8Fvn7x";

export const createClient = (cookieStore) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore?.set?.(name, value, options));
          } catch {
            // Called from Server Component
          }
        },
      },
    }
  );
};
