import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(
        new URL('/update-password', request.url)
      );
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }
  }

  const response = NextResponse.redirect(
    new URL('/forgotten-password', request.url)
  );
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
