'use client';

import { createImageFileSchema } from '@/modules/media/lib/create-image-file-schema';
import { useToast } from '@/shared/components/ui/use-toast';
import { cn } from '@/shared/utils/cn';
import { useMutation } from '@tanstack/react-query';
import NextImage from 'next/image';
import { useId, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';
import { uploadImageToGallery } from '../services/upload-image-to-gallery';

const imageSchema = createImageFileSchema();

type UploadImageResponse = {
  url: string;
  height: number;
  width: number;
  alt: string;
};

type ImageUploadAreaProps = {
  onSuccessfulUpload: (data: UploadImageResponse) => void;
  onFailedUpload: (error: Error) => void;
  defaultValue?: {
    src: string | undefined;
  };
  description?: string;
};

export function ImageUploadArea({
  onFailedUpload,
  onSuccessfulUpload,
  defaultValue,
  description,
}: ImageUploadAreaProps) {
  const id = useId();
  const { toast } = useToast();

  const [image, setImage] = useState(defaultValue?.src);

  const uploadImageToGalleryMutation = useMutation({
    mutationFn: async (images: File[]) => {
      const firstImage = Array.isArray(images) ? images[0] : null;

      if (!firstImage) throw new Error('Faça upload de uma imagem');

      // Usado para pegar a altura e largura da imagem
      const image = new Image();
      image.src = URL.createObjectURL(firstImage);
      setImage(image.src);

      return new Promise<UploadImageResponse>((resolve, reject) => {
        image.onload = async () => {
          const width = image.width;
          const height = image.height;

          try {
            const data = await uploadImageToGallery({
              file: firstImage,
              height: height,
              width: width,
              alt: description || '',
            });

            resolve(data);
          } catch (error) {
            reject(error);
          }
        };
      });
    },
    onError: error => {
      setImage(undefined);
      onFailedUpload(error instanceof Error ? error : new Error('Erro desconhecido'));
    },
    onSuccess: data => {
      onSuccessfulUpload(data);
    },
  });

  const onDropFiles = uploadImageToGalleryMutation.mutate;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length === 0) {
        return onDropFiles(acceptedFiles);
      }

      const listFormat = new Intl.ListFormat('pt-BR', {
        style: 'long',
        type: 'conjunction',
      });

      fileRejections.forEach(fileRejection => {
        toast({
          variant: 'destructive',
          title: 'Arquivo inválido: ' + fileRejection.file.name,
          description: listFormat.format(fileRejection.errors.map(error => error.message)),
        });
      });
    },
    validator: file => {
      const parsed = imageSchema.safeParse([file]);

      if (parsed.success) return null;

      return {
        code: 'invalid-file',
        message: 'Arquivo inválido',
      };
    },
  });

  const currentSrc = image || defaultValue?.src;

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'flex h-80 w-full cursor-pointer items-center justify-center rounded bg-background transition-colors duration-200 ease-in-out',
          'hover:border-accent/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          'relative border',
        )}
      >
        <input className="peer" id={id} {...getInputProps()} />

        <div
          style={{ width: 'calc(100% - 1rem)', height: 'calc(100% - 1rem)' }}
          className={cn(
            'pointer-events-none absolute rounded border-2 border-dashed border-gray-300',
            isDragActive && 'animate-pulse border-accent-foreground transition-all duration-1000 ease-in-out',
          )}
        />

        <div
          style={{ width: 'calc(100% - 1rem)', height: 'calc(100% - 1rem)' }}
          className="origin-center overflow-clip rounded"
        >
          {currentSrc ? (
            <NextImage
              src={currentSrc}
              className="h-full w-full object-contain transition-all duration-300 ease-in-out"
              alt="Imagem para upload"
              width={1800}
              height={640}
            />
          ) : (
            <p className="flex h-full items-center justify-center px-4 text-center text-sm text-secondary-foreground">
              Arraste e solte uma imagem aqui ou clique para adicionar uma imagem
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
