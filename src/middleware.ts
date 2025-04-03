import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from './modules/auth/constants/cookies';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // MIDDLEWARE DE MANUTENÇÃO
  console.log('middleware', request.nextUrl.pathname);
  console.log('process.env.MAINTENANCE_MODE', process.env.MAINTENANCE_MODE);
  console.log('process.env.MAINTENANCE_MODE', typeof process.env.MAINTENANCE_MODE);

  if (request.nextUrl.pathname === '/wip') {
    return NextResponse.next();
  }

  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.rewrite(new URL('/wip', request.url));
  }

  // O TEMPO DE VIDA DO COOKIE É AUMENTADO A CADA REQUISIÇÃO GET POR CONTA DE UMA LIMITAÇÃO DO NEXT.JS AO USARMOS SERVER ACTIONS ETC E TAL
  if (request.method === "GET") {
    const response = NextResponse.next();
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;

    if (token !== null) {
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      });
    }

    return response;
  }

  // MIDDLEWARE DE PROTEÇÃO CSRF
  const originHeader = request.headers.get("Origin");

  const primaryHostHeader = request.headers.get("Host");
  const secondaryHostHeader = request.headers.get("X-Forwarded-Host");
  const hostHeader = primaryHostHeader ?? secondaryHostHeader;

  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403
    });
  }

  let origin: URL;

  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403
    });
  }

  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403
    });
  }

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
