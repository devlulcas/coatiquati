import { env } from '@/env';
import type { CreatePresignedURLFn, DeleteFileByKeyFn, HeadFileByKeyFn } from '@/modules/file/lib/storage';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { nanoid } from '@/shared/utils/nanoid';
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const createPresignedURLCommand: CreatePresignedURLFn = async (
  { fileType, fileSize, checksum, filename },
  userMetadata,
) => {
  const key = nanoid(32);

  const putObjectCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: userMetadata.id,
      filename: filename,
    },
  });

  const SIXTY_SECONDS = 60;

  try {
    const url = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: SIXTY_SECONDS,
    });

    return ok({ url, key });
  } catch (error) {
    const message = `Falha ao gerar URL pré assinada para arquivo: ${filename}`;
    return fail(error instanceof Error ? error.message : message);
  }
};

export const deleteFileCommand: DeleteFileByKeyFn = async (key: string) => {
  const deleteObjectResult = await wrapAsyncInResult(
    s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      }),
    ),
  );

  if (deleteObjectResult.type === 'fail') {
    return fail('Falha ao remover arquivo com chave: ' + key);
  }

  return ok('Arquivo com chave ' + key + ' foi deletado com sucesso');
};

export const headFileCommand: HeadFileByKeyFn = async (key: string) => {
  try {
    const cmd = new HeadObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
    });

    const data = await s3Client.send(cmd);

    // I always get 200 for my testing if the object exists
    const exists = data.$metadata.httpStatusCode === 200;

    return ok(exists);
  } catch (error) {
    log.error(error);
    const err = error as any;

    if (err.$metadata?.httpStatusCode === 404) {
      // doesn't exist and permission policy includes s3:ListBucket
      return ok(false);
    } else if (err.$metadata?.httpStatusCode === 403) {
      // doesn't exist, permission policy WITHOUT s3:ListBucket
      return ok(false);
    }

    return ok(false);
  }
};

export function getURL(key: string) {
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
