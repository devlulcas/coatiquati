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
    <>
      {value ? (
        <div className="w-full flex relative">
          <Image src={value} alt="Imagem" className="rounded-lg mx-auto" width={500} height={500} />

          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <UploadButton endpoint={endpoint} onClientUploadComplete={setValueCallback} />
          </div>
        </div>
      ) : (
        <UploadDropzone className="mt-0" endpoint={endpoint} onClientUploadComplete={setValueCallback} />
      )}
    </>
  );
}
