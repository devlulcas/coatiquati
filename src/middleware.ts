import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('middleware', request.nextUrl.pathname);
  console.log('process.env.MAINTENANCE_MODE', process.env.MAINTENANCE_MODE);
  console.log('process.env.MAINTENANCE_MODE', typeof process.env.MAINTENANCE_MODE);

  if (request.nextUrl.pathname === '/wip') {
    return NextResponse.next();
  }

  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.rewrite(new URL('/wip', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
