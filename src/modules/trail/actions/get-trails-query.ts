'use server';

import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { contentStatus } from '@/shared/constants/content-status';
import { z } from 'zod';
import { TrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

const getTrailsUseCaseSchema = z.object({
  search: z.coerce.string().optional(),
  skip: z.coerce.string().optional().transform(Number),
  take: z.coerce.string().optional().transform(Number),
  category: z.coerce.string().optional(),
  authorId: z.coerce.string().optional(),
  status: z.coerce
    .string()
    .optional()
    .refine(
      value => {
        if (typeof value === 'undefined') return true;
        const validStatuses: string[] = Object.values(contentStatus);
        return validStatuses.includes(value);
      },
      { message: 'Status inválido' },
    ),
});

export type TrailSearchSchema = z.infer<typeof getTrailsUseCaseSchema>;

export async function getTrailsQuery(params: TrailSearchSchema = { skip: 0, take: 30 }): Promise<Trail[]> {
  const validatedParams = getTrailsUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para buscar trilhas.');
  }

  const session = await getPageSession();

  const trailRepository = new TrailRepository();

  return trailRepository.getTrails(validatedParams.data, isAdminOrAbove(session?.user.role));
}
