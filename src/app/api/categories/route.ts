import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { SearchTrailCategoriesUseCase } from '@/modules/category/use-cases/search-trails-categories-use-case';
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

  const searchTrailCategoriesUseCase = new SearchTrailCategoriesUseCase();

  const categories = await searchTrailCategoriesUseCase.execute({ skip, take, search });

  return NextResponse.json({
    data: {
      categories: categories.map(category => ({
        name: category.name,
      })),
    },
    pagination: { skip, take },
  });
};
