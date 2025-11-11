import type { AppType } from '@/app/api/[[...route]]/app';
import { env } from '@/env';
import { hc } from 'hono/client';

export const apiClient = hc<AppType>(env.NEXT_PUBLIC_WEBSITE);
