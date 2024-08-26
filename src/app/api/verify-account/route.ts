import { verifyEmailMutation } from '@/modules/auth/actions/verify-email-mutation';
import { type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  await verifyEmailMutation(token);
};
