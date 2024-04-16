import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { searchTrailCategoriesQuery } from '@/modules/category/actions/search-trails-categories-query';
import { NextResponse, type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const authRequest = handleApiAuthRequest(request);
  const session = await authRequest.validate();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const skip = Number(request.nextUrl.searchParams.get('skip')) || 0;
  const take = Number(request.nextUrl.searchParams.get('take')) || 10;
  const search = request.nextUrl.searchParams.get('search') || '';

  const categoriesResult = await searchTrailCategoriesQuery({ skip, take, search });

  if (categoriesResult.type === 'fail') {
    return NextResponse.json(
      {
        data: {
          categories: [],
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: {
      categories: categoriesResult.value.map(({ name }) => ({ name })),
    },
    pagination: { skip, take },
  });
};
