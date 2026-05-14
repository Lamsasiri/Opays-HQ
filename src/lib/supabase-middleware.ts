import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { canAccessPath } from './rbac';

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-opays-pathname', pathname);

  const createResponse = () =>
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  let supabaseResponse = createResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = createResponse();
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Use getUser() not getSession() for server-side verification.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user and trying to access dashboard, redirect to login
  if (!user && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is authenticated and accessing a protected dashboard route
  if (user && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, role, type, is_admin, permissions')
      .eq('id', user.id)
      .single();

    if (!profile || !canAccessPath(profile, pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // If user is authenticated and on login page, redirect to dashboard
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
