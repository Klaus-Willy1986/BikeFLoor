import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

const publicPaths = ['/login', '/signup', '/forgot-password', '/callback'];

function isPublicPath(pathname: string) {
  // Root / is public (landing page)
  if (pathname === '/' || pathname === '/de' || pathname === '/en') return true;
  // API routes are handled separately
  if (pathname.startsWith('/api/')) return true;
  // Auth pages
  return publicPaths.some(
    (p) => pathname.endsWith(p) || pathname.includes(p + '/')
  );
}

export async function middleware(request: NextRequest) {
  // Run next-intl middleware first
  const response = intlMiddleware(request);

  // Refresh Supabase session
  const { user } = await updateSession(request, response);

  const { pathname } = request.nextUrl;

  // If not logged in and trying to access protected route, redirect to login
  if (!user && !isPublicPath(pathname)) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, manifest
     * - api routes that handle their own auth
     */
    '/((?!_next/static|_next/image|favicon.ico|icons/|manifest).*)',
  ],
};
