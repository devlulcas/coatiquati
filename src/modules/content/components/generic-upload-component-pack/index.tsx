import { useToast } from '@/shared/components/ui/use-toast';
import { generateComponents } from '@uploadthing/react';
import type React from 'react';
import type { GlobalFileRouter } from '../../lib/global-file-router';

const {
  UploadButton: UploadButtonRaw,
  UploadDropzone: UploadDropzoneRaw,
  Uploader,
} = generateComponents<GlobalFileRouter>();

export const UploadButton = (
  props: React.ComponentPropsWithoutRef<typeof UploadButtonRaw>
) => {
  const { toast } = useToast();
  return (
    <UploadButtonRaw
      appearance={{
        button:
          'px-4 transition-colors ut-ready:bg-brand-600 ut-ready:text-brand-50 ut-uploading:cursor-not-allowed rounded bg-primary text-primary-foreground bg-none',
        container: 'w-full',
        allowedContent: 'text-white mt-2 text-sm',
      }}
      onClientUploadComplete={(res) => {
        const fileNames = res?.map((file) => file.name).toLocaleString();

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
            return 'Suba seu arquivo .md aqui';
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

export const UploadDropzone = (
  props: React.ComponentPropsWithoutRef<typeof UploadDropzoneRaw>
) => {
  const { toast } = useToast();

  return (
    <UploadDropzoneRaw
      className="p-2"
      onClientUploadComplete={(res) => {
        const fileNames = res?.map((file) => file.name).toLocaleString();

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
            return 'Suba seu arquivo .md aqui';
          }

          return 'Estamos nos preparando';
        },
        label({ ready, isUploading, uploadProgress }) {
          if (!ready) {
            return 'Opa! Espera aí...';
          }

          if (isUploading) {
            return 'Fazendo upload do arquivo... ' + uploadProgress + '%';
          }

          return 'Arrasta e solta o arquivo aqui, ou clica pra selecionar o arquivo';
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
