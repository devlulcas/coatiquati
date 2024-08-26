import { isFail, type Result } from '@/shared/lib/result';
import { computeFileSHA256 } from '../lib/compute-file-hash';

type PresignedUrlData = {
  url: string;
  key: string;
};

export async function fetchPresignedUrl(file: File): Promise<PresignedUrlData> {
  const response = await fetch('/api/file-upload', {
    method: 'POST',
    body: JSON.stringify({
      fileType: file.type,
      fileSize: file.size,
      checksum: await computeFileSHA256(file),
      filename: file.name,
    }),
  });

  const json = (await response.json()) as Result<PresignedUrlData>;

  if (isFail(json)) {
    throw new Error(json.fail);
  }

  return json.value;
}
