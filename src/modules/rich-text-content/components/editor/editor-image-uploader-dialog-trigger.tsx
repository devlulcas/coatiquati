'use client';

import { ImageUploadDialogTrigger } from '@/modules/file/components/image-upload-dialog-trigger';
import { uploadImageToGallery } from '@/modules/file/services/upload-image-to-gallery';
import { useToast } from '@/shared/components/ui/use-toast';
import { type Editor } from '@tiptap/react';

type EditormageUploaderDialogTriggerProps = { editor: Editor | null; children: React.ReactNode };
export function EditormageUploaderDialogTrigger({ children, editor }: EditormageUploaderDialogTriggerProps) {
  const imageUpload = (src: string, alt: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src, alt }).run();
    }
  };

  const { toast } = useToast();

  return (
    <ImageUploadDialogTrigger
      uploadImage={uploadImageToGallery}
      onFailedUpload={error => {
        toast({
          title: error.message,
        });
      }}
      onSuccessfulUpload={data => {
        toast({
          title: 'Imagem salva com sucesso!',
        });
        imageUpload(data.url, data.alt);
      }}
    >
      {children}
    </ImageUploadDialogTrigger>
  );
}
