import { createPresignedURLHandler } from '@/modules/file/actions/create-presigned-url-handler';
import { updateUploadedFileHandler } from '@/modules/file/actions/update-uploaded-file-handler';

export const POST = createPresignedURLHandler;

export const PUT = updateUploadedFileHandler;
