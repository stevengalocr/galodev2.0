import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isHerramientasProtected =
    request.nextUrl.pathname.startsWith('/herramientas') &&
    !request.nextUrl.pathname.startsWith('/herramientas/login');

  if (!user && isHerramientasProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/herramientas/login';
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === '/herramientas/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/herramientas';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/herramientas/:path*'],
};
