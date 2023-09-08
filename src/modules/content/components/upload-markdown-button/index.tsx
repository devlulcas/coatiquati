'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { UploadButton } from '../generic-upload-component-pack';

export function UploadMarkdownButton() {
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Subir Markdown</Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <UploadButton
            endpoint="markdown"
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
              allowedContent({
                ready,
                fileTypes,
                isUploading,
                uploadProgress,
              }) {
                if (!ready) {
                  return 'Espera um pouco aí...';
                }

                if (isUploading) {
                  return 'Fazendo upload do arquivo... ' + uploadProgress + '%';
                }

                return `Você pode subir isso aqui: ${fileTypes.toLocaleString()}`;
              },
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
