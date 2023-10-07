'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { Editor } from '@tiptap/react';
import { ImagePlusIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { UploadDropzone } from '../generic-upload-component-pack';
import { EditorActionButton } from './editor-action-button';

type ImageUploaderProps = {
  onSave: (src: string, alt: string) => void;
};

export function ImageUploaderDialogTrigger({ editor }: { editor: Editor | null }) {
  const imageUpload = (src: string, alt: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src, alt }).run();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditorActionButton icon={<ImagePlusIcon />} label="imagem" />
      </DialogTrigger>

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
        <div className="w-full flex">
          <Image src={src} alt={altRef.current} className="rounded-lg mx-auto" width={500} height={500} />
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

      <div className="w-full mt-3">
        <Label htmlFor="alt">Texto alternativo</Label>

        <div className="flex gap-2 w-full mt-2">
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
