import { z } from 'zod';

export const createPaginationSchema = (
  take: number,
  skip: number,
) => {
  return z.object({
    take: z.number().optional().default(take),
    skip: z.number().optional().default(skip),
  });
};

export type PaginationSchema = z.infer<ReturnType<typeof createPaginationSchema>>;
