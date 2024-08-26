import { validateRequest } from '@/modules/auth/services/lucia';
import { searchTrailCategoriesQuery } from '@/modules/category/actions/search-trails-categories-query';
import { NextResponse, type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { user } = await validateRequest();

  if (!user) {
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

  const categories = categoriesResult.value.map(({ name }) => ({ name }));

  return NextResponse.json({
    data: { categories },
    pagination: { skip, take },
  });
};
