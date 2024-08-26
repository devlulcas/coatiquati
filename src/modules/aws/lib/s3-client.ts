import { env } from '@/env';
import { fail, wrapAsyncInResult } from '@/shared/lib/result';
import { nanoid } from '@/shared/utils/nanoid';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10MB

export const getPresignedURLSchema = z.object({
  fileType: z.string().min(1, { message: 'O tipo do arquivo deve ser uma string' }),
  fileSize: z.number().nonnegative({ message: 'O tamanho do arquivo deve ser um número' }),
  checksum: z.string().min(1, { message: 'O checksum do arquivo deve ser uma string' }),
  filename: z.string().min(1, { message: 'O nome do arquivo deve ser uma string' }),
});

export type GetPresignedURL = z.infer<typeof getPresignedURLSchema>;

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function createSignedURL({ fileType, fileSize, checksum, filename }: GetPresignedURL, userId: string) {
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    return fail(
      `Arquivo do tipo ${fileType} não é permitido`,
    );
  }

  if (fileSize > MAX_FILE_SIZE) {
    return fail(
      `O arquivo excede o tamanho máximo de ${MAX_FILE_SIZE} bytes`,
    );
  }

  const key = nanoid(32);

  const putObjectCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: userId,
      filename: filename,
    },
  });

  const SIXTY_SECONDS = 60;

  const url = await getSignedUrl(s3Client, putObjectCommand, {
    expiresIn: SIXTY_SECONDS,
  });

  return { url, key };
}

export async function deleteFile(key: string) {
  const deleteObjectResult = await wrapAsyncInResult(
    s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      }),
    ),
  );

  return deleteObjectResult;
}

export function getURL(key: string) {
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
