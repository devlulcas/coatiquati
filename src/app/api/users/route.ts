import { getUsersQuery } from '@/modules/user/actions/get-users-query';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  const url = new URL(req.url)

  const res = await getUsersQuery({
    search: url.searchParams.get('search') ?? undefined,
    skip: Number(url.searchParams.get('skip') || 0),
    take: Number(url.searchParams.get('skip') || 30),
  })

  return NextResponse.json(res);
};
