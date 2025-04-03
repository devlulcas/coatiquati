'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { contentStatus } from '@/shared/constants/content-status';
import { fail, ok, type Result } from '@/shared/lib/result';
import { z } from 'zod';
import { TrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

const trailSearchSchema = z.object({
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

export type TrailSearchSchema = z.infer<typeof trailSearchSchema>;

export async function getTrailsQuery(params: TrailSearchSchema = { skip: 0, take: 30 }): Promise<Result<Trail[]>> {
  const validatedParams = trailSearchSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail(validatedParams.error.errors.join(', '));
  }

  const { data: user } = await validateRequest();

  const trailRepository = new TrailRepository();

  try {
    const trails = await trailRepository.getTrails(validatedParams.data, isAdminOrAbove(user?.role));
    return ok(trails);
  } catch (error) {
    log.error('Falha ao buscar trilhas', String(error));
    return fail('Falha ao buscar trilhas');
  }
}
