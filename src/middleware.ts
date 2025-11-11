import { type NextRequest, NextResponse } from 'next/server';

const UNDER_MAINTENANCE = process.env.MAINTENANCE_MODE === 'true';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // MIDDLEWARE DE MANUTENÇÃO
  if (request.nextUrl.pathname === '/wip') {
    return NextResponse.next();
  }

  if (UNDER_MAINTENANCE) {
    return NextResponse.rewrite(new URL('/wip', request.url));
  }
  // FIM DO MIDDLEWARE DE MANUTENÇÃO

  return NextResponse.next();
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
