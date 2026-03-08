import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ['/dashboard', '/bikes', '/components', '/services', '/rides', '/settings'];
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/callback'];

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length);
    }
    if (pathname === `/${locale}`) {
      return '/';
    }
  }
  return pathname;
}

export async function proxy(request: NextRequest) {
  // Run next-intl middleware first (handles locale detection, rewrites, redirects)
  const response = intlMiddleware(request);

  // Refresh Supabase session on the response
  const { user } = await updateSession(request, response);

  // Determine the path without locale prefix
  const cleanPath = stripLocalePrefix(request.nextUrl.pathname);

  const isProtected = PROTECTED_PATHS.some((p) => cleanPath.startsWith(p));
  const isAuth = AUTH_PATHS.some((p) => cleanPath.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth routes
  if (isAuth && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
