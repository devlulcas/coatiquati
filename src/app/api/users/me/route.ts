import { validateRequest } from '@/modules/auth/services/lucia';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, {
      status: 401,
    });
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    role: user.role,
    verifiedAt: user.verifiedAt,
  });
};
