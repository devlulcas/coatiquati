'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { createPaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { type z } from 'zod';
import { TrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

const getTrailsUseCaseSchema = createPaginationSchemaWithSearch(30);

type GetTrailsUseCaseSchema = Partial<z.infer<typeof getTrailsUseCaseSchema>>;

export async function getTrailsQuery(params: GetTrailsUseCaseSchema = {}): Promise<Trail[]> {
  const validatedParams = getTrailsUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para buscar trilhas.');
  }

  const session = await getActionSession();

  const trailRepository = new TrailRepository();

  return trailRepository.getTrails(validatedParams.data, isAdminOrAbove(session?.user.role));
}
