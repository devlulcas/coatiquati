'use client';

import { UploadDropzone } from '@/modules/media/components/generic-upload-component-pack';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { type Editor } from '@tiptap/react';
import Image from 'next/image';
import { useRef, useState } from 'react';

type ImageUploaderProps = {
  onSave: (src: string, alt: string) => void;
};

export function ImageUploaderDialogTrigger({ editor, children }: { editor: Editor | null; children: React.ReactNode }) {
  const imageUpload = (src: string, alt: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src, alt }).run();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <ImageUploader onSave={imageUpload} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function ImageUploader({ onSave }: ImageUploaderProps) {
  const { toast } = useToast();
  const [src, setSrc] = useState('');
  const altRef = useRef('');

  const handleSave = () => {
    if (!src) {
      return toast({
        title: 'Imagem não selecionada',
        variant: 'destructive',
      });
    }

    if (!altRef.current) {
      return toast({
        title: 'Texto alternativo não preenchido',
        variant: 'destructive',
      });
    }

    onSave(src, altRef.current);
  };

  return (
    <div className="p-2">
      {src ? (
        <div className="flex w-full">
          <Image src={src} alt={altRef.current} className="mx-auto rounded-lg" width={500} height={500} />
        </div>
      ) : (
        <UploadDropzone
          className="mt-0"
          endpoint="textEditorImage"
          onClientUploadComplete={res => {
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

            setSrc(file.url);
          }}
        />
      )}

      <div className="mt-3 w-full">
        <Label htmlFor="alt">Texto alternativo</Label>

        <div className="mt-2 flex w-full gap-2">
          <Input
            id="alt"
            placeholder="Texto alternativo"
            onChange={e => {
              altRef.current = e.target.value;
            }}
          />

          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}
