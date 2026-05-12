import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Route access map: defines which roles can access each dashboard section
const ROUTE_ACCESS: Record<string, string[]> = {
  '/dashboard/treasury':     ['CEO', 'COO', 'ADMIN'],
  '/dashboard/equity':       ['CEO', 'COO', 'CTO', 'SALES', 'ADMIN'], // All associates can view
  '/dashboard/leads':        ['CEO', 'COO', 'SALES', 'ADMIN'],
  '/dashboard/studio':       ['CEO', 'SALES', 'ADMIN'],
  '/dashboard/coordination': ['CEO', 'SALES'],
  '/dashboard/contracts':    ['CEO', 'COO', 'ADMIN'],
  '/dashboard/hr':           ['CEO', 'COO', 'ADMIN', 'ENGINEER'], // Employees see their own
  '/dashboard/labs':         ['CEO', 'CTO'],
  '/dashboard/workspace':    ['CEO', 'CTO', 'ADMIN'],
  '/dashboard/settings':     ['CEO', 'COO', 'CTO', 'ADMIN'],
  '/dashboard/admin':        ['CEO', 'ADMIN'],
};

// Routes that are open to all authenticated users
const OPEN_ROUTES = [
  '/dashboard',
  '/dashboard/projects',
  '/dashboard/tasks',
  '/dashboard/knowledge',
  '/dashboard/ideas',
  '/dashboard/calendar',
  '/dashboard/brand',
  '/dashboard/profile',
  '/dashboard/preview',
  '/dashboard/audit',
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
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

  const pathname = request.nextUrl.pathname;

  // If no user and trying to access dashboard, redirect to login
  if (!user && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is authenticated and accessing a protected dashboard route
  if (user && pathname.startsWith('/dashboard')) {
    // Check if this is a restricted route
    const matchedRoute = Object.keys(ROUTE_ACCESS).find(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    if (matchedRoute) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin, permissions')
        .eq('id', user.id)
        .single();

      const role = profile?.role || 'ENGINEER';
      const isAdmin = profile?.is_admin === true;
      const permissions = profile?.permissions || {};

      // Admin override — admins can access everything
      if (isAdmin) {
        return supabaseResponse;
      }

      // Check explicit permission overrides from AccessControlModal
      const moduleId = matchedRoute.replace('/dashboard/', '');
      if (permissions[moduleId] === true) {
        return supabaseResponse;
      }
      if (permissions[moduleId] === false) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      // Check role-based access
      const allowedRoles = ROUTE_ACCESS[matchedRoute];
      if (!allowedRoles.includes(role)) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
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
