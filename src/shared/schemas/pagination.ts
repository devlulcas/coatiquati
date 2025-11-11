import { z } from 'zod';

export const paginationSchema = z.object({
  skip: z.coerce.number().optional().default(0),
  take: z.coerce.number().optional().default(40),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
