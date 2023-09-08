import { auth } from '@/modules/auth/services/lucia';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const authHandler = async (request: NextRequest) => {
  const authRequest = auth.handleRequest({ request, cookies });

  const session = await authRequest.validate();

  if (!session) {
    return null;
  }

  return session.user;
};

/**
 * All the file upload routes must be exported as a single object
 * UploadThing integration will automatically create the routes
 */
export const globalFileRouter = {
  markdown: f({
    text: { maxFileSize: '2MB' },
    'text/markdown': { maxFileSize: '2MB' },
  })
    .middleware(async ({ req }) => {
      const user = await authHandler(req);

      if (!user) {
        throw new Error('Unauthorized: You must be logged in to upload');
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
} satisfies FileRouter;

export type GlobalFileRouter = typeof globalFileRouter;
