'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UploadDropzone } from '../generic-upload-component-pack';

const imageContentSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  alt: z.string(),
});

type ImageContentSchema = z.infer<typeof imageContentSchema>;

type ImageContentFormProps = {
  onSubmit: (data: ImageContentSchema) => void | Promise<void>;
  defaultValues?: Partial<ImageContentSchema>;
  className?: string;
};

export function ImageContentForm({
  onSubmit,
  className,
  defaultValues,
}: ImageContentFormProps) {
  const { toast } = useToast();

  const form = useForm<ImageContentSchema>({
    resolver: zodResolver(imageContentSchema),
    defaultValues: defaultValues,
  });

  const [src, setSrc] = useState<string | null>(null);

  if (src) {
    form.setValue('url', src);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'flex h-full flex-col gap-4 p-4 border rounded-lg',
          className
        )}
        action="/api/sign-in"
      >
        {src ? (
          <div className="w-full flex">
            <Image
              src={src}
              alt={form.watch('alt')}
              className="rounded-lg mx-auto"
              width={500}
              height={500}
            />
          </div>
        ) : (
          <UploadDropzone
            className="mt-0"
            endpoint="newImageContent"
            onClientUploadComplete={(res) => {
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

        <Button className="w-full mt-auto" type="submit">
          Adicionar camada
        </Button>
      </form>
    </Form>
  );
}
