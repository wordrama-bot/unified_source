import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();

    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination =
        data.redirectType === 'PASSWORD_RECOVERY'
          ? '/update-password'
          : '/';

      const response = NextResponse.redirect(
        new URL(destination, request.url)
      );

      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }
  }

  const response = NextResponse.redirect(
    new URL('/login', request.url)
  );

  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
