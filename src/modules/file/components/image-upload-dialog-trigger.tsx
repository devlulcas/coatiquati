import { createImageFileSchema } from '@/modules/media/lib/create-image-file-schema';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FileDropZone } from './file-drop-zone';

const formSchema = z.object({
  image: createImageFileSchema().optional(),
  altText: z
    .string({
      required_error: 'Digite um texto alternativo',
    })
    .min(10, {
      message: 'O texto alternativo tem que ter ao menos 10 caracteres',
    }),
});

type ImageUploadFormValues = z.infer<typeof formSchema>;

type ImageInput = { file: File; height: number; width: number; alt: string };

type UploadImageResponse = {
  url: string;
  height: number;
  width: number;
  alt: string;
};

type ImageUploadDialogTriggerProps = {
  uploadImage: (image: ImageInput) => Promise<UploadImageResponse>;
  onSuccessfulUpload: (data: UploadImageResponse) => void;
  onFailedUpload: (error: Error) => void;
  children: React.ReactNode;
};

export function ImageUploadDialogTrigger({
  children,
  onFailedUpload,
  onSuccessfulUpload,
  uploadImage,
}: ImageUploadDialogTriggerProps) {
  const id = useId();

  const form = useForm<ImageUploadFormValues>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const listFormat = new Intl.ListFormat('pt-BR', {
    style: 'long',
    type: 'disjunction',
  });

  const imageDropzone = useDropzone({
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(fileRejection => {
          toast({
            variant: 'destructive',
            title: 'Arquivo inválido: ' + fileRejection.file.name,
            description: listFormat.format(fileRejection.errors.map(error => error.message)),
          });
        });
      } else {
        form.setValue('image', acceptedFiles);
      }
    },
    validator: file => {
      const parsed = formSchema.pick({ image: true }).safeParse({ image: [file] });

      if (parsed.success) return null;

      const imageErrors = parsed.error.flatten().fieldErrors.image ?? [];

      return {
        code: 'invalid-file',
        message: listFormat.format(imageErrors.map(error => error)),
      };
    },
  });

  const onSubmit = async (values: ImageUploadFormValues) => {
    try {
      const firstImage = values.image ? values.image[0] : null;

      if (!firstImage) throw new Error('Faça upload de uma imagem');

      const image = new Image();
      image.src = URL.createObjectURL(firstImage);

      const data = await uploadImage({
        file: firstImage,
        height: image.height,
        width: image.width,
        alt: values.altText,
      });

      onSuccessfulUpload(data);
      setIsOpen(false);
    } catch (error) {
      onFailedUpload(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      form.reset();
    }
  };

  const disabled = process.env.NEXT_PUBLIC_FLAG_DISABLE_IMAGE_UPLOAD === 'true';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} aria-labelledby={id}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      {disabled ? (
        <DialogContent>
          <DialogHeader>Imagem</DialogHeader>
          <p className="text-center text-muted-foreground">O upload de imagens está desativado</p>
        </DialogContent>
      ) : (
        <DialogContent className="h-fit max-h-[90dvh]">
          <DialogHeader>Imagem</DialogHeader>
          <Form {...form}>
            <form
              encType="multipart/form-data"
              id={id}
              method="POST"
              className="h-full w-full space-y-3"
              onSubmit={e => {
                e.stopPropagation();
                e.preventDefault();
                return form.handleSubmit(onSubmit)(e);
              }}
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Imagem</FormLabel>
                    <FormControl>
                      <FileDropZone dropzoneState={imageDropzone}>
                        <FileDropZone.Container>
                          <FileDropZone.Input {...field} />
                          <FileDropZone.Preview />
                          <FileDropZone.Button />
                        </FileDropZone.Container>
                      </FileDropZone>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="altText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição da imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="Imagem com fundo azul, pessoas correndo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full items-center gap-2">
                {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
