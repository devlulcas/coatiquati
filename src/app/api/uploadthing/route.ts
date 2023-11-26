import { globalFileRouter } from '@/modules/media/lib/global-file-router';
import { createNextRouteHandler } from 'uploadthing/next';

export const { GET, POST } = createNextRouteHandler({
  router: globalFileRouter,
});
