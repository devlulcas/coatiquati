import { NextResponse, type NextRequest } from 'next/server';
import { roles } from './modules/auth/constants/roles';
import { auth } from './modules/auth/services/lucia';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const authRequest = auth.handleRequest(request);

    const session = await authRequest.validate();

    if (session === null) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const acceptRoles: string[] = [roles.ADMIN, roles.USER];

    if (!acceptRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}
