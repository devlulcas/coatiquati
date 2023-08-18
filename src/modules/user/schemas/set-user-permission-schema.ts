import { z } from 'zod';

export const setUserPermissionUseCaseSchema = z.object({
  userId: z.string(),
  permission: z.string(),
});

export type SetUserPermissionSchema = z.infer<
  typeof setUserPermissionUseCaseSchema
>;
