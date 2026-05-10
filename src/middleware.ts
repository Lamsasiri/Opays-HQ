import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 1. Si pas de session et on essaie d'accéder au HQ, retour au login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Si session active, on vérifie le rôle pour les zones sensibles
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = profile?.role;

    // Exemple : Restriction de la zone Equity aux fondateurs uniquement
    if (req.nextUrl.pathname.startsWith('/dashboard/equity') && !['CEO', 'COO'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Restriction de la zone Leads (Ventes) aux Sales et Fondateurs
    if (req.nextUrl.pathname.startsWith('/dashboard/leads') && !['CEO', 'COO', 'SALES'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
