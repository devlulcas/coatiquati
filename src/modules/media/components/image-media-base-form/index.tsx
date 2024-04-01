'use client';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ClassValue } from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ImageUploaderInput } from '../image-uploader-input';

const formSchema = z.object({
  src: z.string({ required_error: 'Faça upload do arquivo' }).url({ message: 'URL inválida' }),
  alt: z.string({ required_error: 'Insira uma descrição' }).min(3, { message: 'Descrição muito curta' }),
});

export type ImageMediaFormValues = z.infer<typeof formSchema>;

type ImageMediaBaseFormProps = {
  onSubmit: (data: ImageMediaFormValues) => void | Promise<void>;
  defaultValues?: Partial<ImageMediaFormValues>;
  className?: ClassValue;
};

export function ImageMediaBaseForm({ onSubmit, className, defaultValues }: ImageMediaBaseFormProps) {
  const { toast } = useToast();

  const form = useForm<ImageMediaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const innerOnSubmit = async (data: ImageMediaFormValues) => {
    try {
      await onSubmit(data);
      toast({ title: 'Imagem adicionada com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao adicionar imagem',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(innerOnSubmit)}
        className={cn('flex h-full flex-col gap-4', className)}
      >
        <ImageUploaderInput
          endpoint="newImageMedia"
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
