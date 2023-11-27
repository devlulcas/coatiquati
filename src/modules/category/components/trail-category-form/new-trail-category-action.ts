'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import { CreateNewTrailCategoryUseCase } from '../../use-cases/create-new-trail-category-use-case';

export async function newTrailCategoryAction(data: { name: string }) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado como administrador para criar uma nova categoria.');
  }

  const createNewTrailCategoryUseCase = new CreateNewTrailCategoryUseCase();
  createNewTrailCategoryUseCase.execute(data, session);

  revalidatePath('/api/categories');
}
