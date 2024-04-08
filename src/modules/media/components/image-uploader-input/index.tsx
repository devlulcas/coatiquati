'use client';

import { useToast } from '@/shared/components/ui/use-toast';
import Image from 'next/image';
import { useCallback } from 'react';
import type { UploadFileResponse } from 'uploadthing/client';
import type { GlobalFileRouterEndpoints } from '../../lib/global-file-router';
import { UploadButton, UploadDropzone } from '../generic-upload-component-pack';

type ImageUploaderInputProps = {
  value?: string;
  setValue: (url: string) => void;
  endpoint: GlobalFileRouterEndpoints;
};

export function ImageUploaderInput({ endpoint, value, setValue }: ImageUploaderInputProps) {
  const { toast } = useToast();

  const setValueCallback = useCallback(
    (res: UploadFileResponse[] | undefined) => {
      if (typeof res === 'undefined' || res.length === 0) {
        return toast({
          title: 'Erro ao realizar upload',
          variant: 'destructive',
        });
      }

      const file = res.at(0);

      if (!file) {
        return toast({
          title: 'Erro ao realizar upload',
          variant: 'destructive',
        });
      }

      setValue(file.url);
    },
    [setValue, toast],
  );

  return (
    <div className="flex h-80 w-full items-center justify-center">
      {value ? (
        <div className="relative flex w-full">
          <Image src={value} alt="Imagem" className="mx-auto max-h-80 w-auto rounded-lg" width={500} height={500} />

          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <UploadButton endpoint={endpoint} onClientUploadComplete={setValueCallback} />
          </div>
        </div>
      ) : (
        <UploadDropzone className="mt-0" endpoint={endpoint} onClientUploadComplete={setValueCallback} />
      )}
    </div>
  );
}
