import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const flow = request.nextUrl.searchParams.get('flow');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination =
        flow === 'recovery' ? '/update-password' : '/';

      const response = NextResponse.redirect(
        new URL(destination, request.url)
      );

      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }
  }

  const fallback =
    flow === 'recovery' ? '/forgotten-password' : '/login';

  const response = NextResponse.redirect(
    new URL(fallback, request.url)
  );

  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
