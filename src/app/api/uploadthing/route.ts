import { globalFileRouter } from '@/modules/content/lib/global-file-router';
import { createNextRouteHandler } from 'uploadthing/next';

export const { GET, POST } = createNextRouteHandler({
  router: globalFileRouter,
});
