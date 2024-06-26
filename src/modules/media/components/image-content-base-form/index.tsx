'use client';

import { newImageContentSchema } from '@/modules/image-content/schemas/new-image-content-schema';
import { UploadDropzone } from '@/modules/media/components/generic-upload-component-pack';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

const imageContentSchema = newImageContentSchema;

type ImageContentSchema = z.infer<typeof imageContentSchema>;

type ImageContentBaseFormProps = {
  onSubmit: (data: ImageContentSchema) => void | Promise<void>;
  defaultValues?: Partial<ImageContentSchema>;
  className?: string;
};

export function ImageContentBaseForm({ onSubmit, className, defaultValues }: ImageContentBaseFormProps) {
  const { toast } = useToast();

  const form = useForm<ImageContentSchema>({
    resolver: zodResolver(imageContentSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex h-full flex-col gap-4', className)}
      >
        {form.watch('src') ? (
          <div className="flex w-full">
            <Image
              src={form.watch('src')}
              alt={form.watch('alt')}
              className="mx-auto rounded-lg"
              width={500}
              height={500}
            />
          </div>
        ) : (
          <UploadDropzone
            className="mt-0"
            endpoint="newImageContent"
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

              form.setValue('src', file.url);
            }}
          />
        )}

        <FormField
          control={form.control}
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto alternativo</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Imagem de um gato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Gato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input type="text" placeholder="A imagem fala sobre..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-auto w-full" type="submit">
          Adicionar imagem
        </Button>
      </form>
    </Form>
  );
}
