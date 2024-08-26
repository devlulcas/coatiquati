import { isFail, type Result } from '@/shared/lib/result';
import { fetchPresignedUrl } from './fetch-presigned-url';

export type ImageInput = {
  file: File;
  height: number;
  width: number;
  alt: string;
};

export type UploadImageToGalleryResult = {
  id: string;
  url: string;
  height: number;
  width: number;
  alt: string;
};

export async function uploadImageToGallery(image: ImageInput): Promise<UploadImageToGalleryResult> {
  const presignedUrl = await fetchPresignedUrl(image.file);

  const uploadResponse = await fetch(presignedUrl.url, {
    method: 'PUT',
    body: image.file,
    headers: {
      'Content-Type': image.file.type,
    },
  });

  if (!uploadResponse.ok) throw new Error('Erro ao fazer upload da imagem');

  const response = await fetch('/api/file-upload', {
    method: 'POST',
    body: JSON.stringify({
      key: presignedUrl.key,
      description: image.alt,
    }),
  });

  const json = (await response.json()) as Result<{ url: string; description: string }>;

  if (isFail(json)) {
    throw new Error(json.fail);
  }

  console.log({
    id: presignedUrl.key,
    url: json.value.url,
    height: image.height,
    width: image.width,
    alt: json.value.description,
  });

  return {
    id: presignedUrl.key,
    url: json.value.url,
    height: image.height,
    width: image.width,
    alt: json.value.description,
  };
}
