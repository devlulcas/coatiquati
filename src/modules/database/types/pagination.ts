import { z } from 'zod';

export const createPaginationSchema = (take = 10, skip = 0) => {
  return z.object({
    take: z.number().optional().default(take),
    skip: z.number().optional().default(skip),
  });
};

export const createPaginationSchemaWithSearch = (take = 10, skip = 0) => {
  return createPaginationSchema(take, skip).merge(
    z.object({
      search: z.string().optional().default(''),
    }),
  );
};

export type PaginationSchema = z.infer<ReturnType<typeof createPaginationSchema>>;

export type PaginationSchemaWithSearch = z.infer<
  ReturnType<typeof createPaginationSchemaWithSearch>
>;
