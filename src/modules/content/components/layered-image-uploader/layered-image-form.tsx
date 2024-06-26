'use client';

import { ImageUploaderInput } from '@/modules/media/components/image-uploader-input';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { nanoid } from '@/shared/utils/nanoid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { LayeredImage } from '../layered-image-node';

const layeredImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  title: z.string(),
});

type LayeredImageFormProps = {
  onAdd: (layer: LayeredImage) => void;
  defaultValue?: LayeredImage;
  className?: string;
};

export function LayeredImageForm({ onAdd, defaultValue, className }: LayeredImageFormProps) {
  const form = useForm<LayeredImage>({
    resolver: zodResolver(layeredImageSchema),
    defaultValues: defaultValue,
  });

  const onSubmit = async (values: LayeredImage) => {
    onAdd({
      ...values,
      id: nanoid(),
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex h-full flex-col gap-4 rounded-lg border p-4', className)}
        action="/api/sign-in"
      >
        <ImageUploaderInput
          endpoint="textEditorImage"
          value={form.watch('src')}
          setValue={form.setValue.bind(form, 'src')}
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

        <Button
          variant="secondary"
          className="mt-auto w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
        >
          Adicionar camada
        </Button>
      </form>
    </Form>
  );
}
