import type { GlobalFileRouter } from '@/modules/media/lib/global-file-router';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { useToast } from '@/shared/components/ui/use-toast';
import { generateComponents } from '@uploadthing/react';
import React from 'react';

const {
  UploadButton: UploadButtonRaw,
  UploadDropzone: UploadDropzoneRaw,
  Uploader,
} = generateComponents<GlobalFileRouter>();

export const UploadButton = (props: React.ComponentPropsWithoutRef<typeof UploadButtonRaw>) => {
  const { toast } = useToast();
  return (
    <UploadButtonRaw
      appearance={{
        button:
          'px-4 transition-colors ut-ready:bg-brand-600 focus-within:ring-brand-300 ut-ready:text-brand-50 w-fit ut-uploading:after:bg-brand-600 ut-uploading:cursor-not-allowed ut-button:ut-readying:bg-brand-500/50 rounded bg-primary text-primary-foreground bg-none',
        container: 'w-full',
        allowedContent: 'text-white mt-2 text-sm',
      }}
      onClientUploadComplete={res => {
        const fileNames = res?.map(file => file.name).toLocaleString();

        toast({
          title: 'Upload completo',
          description: `Arquivo(s) ${fileNames} enviado(s) com sucesso!`,
        });
      }}
      onUploadError={(error: Error) => {
        toast({
          title: 'Erro ao fazer upload',
          description: error.message,
          variant: 'destructive',
        });
      }}
      content={{
        button({ ready }) {
          if (ready) {
            return 'Suba seu arquivo aqui';
          }

          return 'Estamos nos preparando';
        },
        allowedContent({ ready, fileTypes, isUploading, uploadProgress }) {
          if (!ready) {
            return 'Espera um pouco aí...';
          }

          if (isUploading) {
            return 'Fazendo upload do arquivo... ' + uploadProgress + '%';
          }

          return `Você pode subir isso aqui: ${fileTypes.toLocaleString()}`;
        },
      }}
      {...props}
    />
  );
};

export const UploadDropzone = (props: React.ComponentPropsWithoutRef<typeof UploadDropzoneRaw>) => {
  const { toast } = useToast();

  return (
    <UploadDropzoneRaw
      className="p-2"
      onClientUploadComplete={res => {
        const fileNames = res?.map(file => file.name).toLocaleString();

        toast({
          title: 'Upload completo',
          description: `Arquivo(s) ${fileNames} enviado(s) com sucesso!`,
        });
      }}
      onUploadError={(error: Error) => {
        toast({
          title: 'Erro ao fazer upload',
          description: error.message,
          variant: 'destructive',
        });
      }}
      appearance={{
        button:
          'px-4 transition-colors ut-ready:bg-brand-600 focus-within:ring-brand-300 ut-ready:text-brand-50 w-fit ut-uploading:after:bg-brand-600 ut-uploading:cursor-not-allowed ut-button:ut-readying:bg-brand-500/50 rounded bg-primary text-primary-foreground bg-none',
        container: 'w-full',
        allowedContent: 'text-white mt-2 text-sm',
      }}
      content={{
        button({ ready }) {
          return ready ? 'Clique pra salvar o arquivo' : 'Estamos nos preparando';
        },
        label({ ready, isUploading, uploadProgress }) {
          if (!ready) {
            return 'Opa! Espera aí...';
          }

          if (isUploading) {
            return (
              <div className="flex items-center flex-col justify-center">
                <span className="text-brand-500">Fazendo upload do arquivo...</span>
                <div className="flex items-center gap-2 justify-center w-full">
                  <Progress className="ml-2" value={uploadProgress} />
                  <Badge>{uploadProgress}%</Badge>
                </div>
              </div>
            );
          }

          return (
            <span className="text-brand-500">Arrasta e solta o arquivo aqui, ou clica pra selecionar o arquivo</span>
          );
        },
        allowedContent({ ready, fileTypes, isUploading, uploadProgress }) {
          if (!ready) {
            return 'Espera um pouco aí...';
          }

          if (isUploading) {
            return 'Fazendo upload do arquivo... ' + uploadProgress + '%';
          }

          return `Você pode subir isso aqui: ${fileTypes.toLocaleString()}`;
        },
      }}
      {...props}
    />
  );
};

export { Uploader };
