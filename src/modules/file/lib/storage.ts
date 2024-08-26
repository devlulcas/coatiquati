import { createPresignedURLCommand, deleteFileCommand, getURL, headFileCommand } from '@/modules/aws/lib/s3-client';
import type { Result } from '@/shared/lib/result';
import type { PresignedURLRequest } from '../schemas/presigned-url-request-schema';

export type CreatePresignedURLFn = (
  options: PresignedURLRequest,
  userMetadata: { id: string },
) => Promise<Result<{ url: string; key: string }>>;

export type DeleteFileByKeyFn = (key: string) => Promise<Result<string>>;

export type HeadFileByKeyFn = (key: string) => Promise<Result<boolean>>;

type FileStorage = {
  createPresignedURL: CreatePresignedURLFn;
  deleteFileByKey: DeleteFileByKeyFn;
  headFileByKey: HeadFileByKeyFn;
  getURLFromKey: (key: string) => string;
};

type FileStorageFactory = () => FileStorage;

const createS3FileStorage: FileStorageFactory = () => {
  return {
    createPresignedURL: createPresignedURLCommand,
    deleteFileByKey: deleteFileCommand,
    headFileByKey: headFileCommand,
    getURLFromKey: getURL,
  };
};

export const storage = createS3FileStorage();
