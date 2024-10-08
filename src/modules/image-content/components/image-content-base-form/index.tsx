'use client';

import { ImageUploadArea } from '@/modules/file/components/image-upload-area';
import { newImageContentSchema } from '@/modules/image-content/schemas/new-image-content-schema';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
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
        <FormField
          control={form.control}
          name="src"
          render={() => (
            <FormItem>
              <FormLabel className="sr-only">Imagem</FormLabel>
              <FormControl>
                <ImageUploadArea
                  onFailedUpload={error => {
                    form.setError('src', error);
                  }}
                  onSuccessfulUpload={data => {
                    form.setValue('src', data.url);
                  }}
                  defaultValue={{ src: form.watch('src') }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button
          className="mt-auto w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
        >
          Adicionar imagem
        </Button>
      </form>
    </Form>
  );
}
