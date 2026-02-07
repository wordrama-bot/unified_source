import { createBrowserClient } from "@supabase/ssr";

/*
createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
*/
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: process.env.NODE_ENV === 'production' && {
        domain: '.wordrama.io',
        path: '/',
        secure: true,
        sameSite: 'Lax',
      }
    }
  );

export const supabase = createClient();
