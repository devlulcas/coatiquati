'use client';

import { ImageUploaderInput } from '@/modules/media/components/image-uploader-input';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ClassValue } from 'clsx';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { newTrailSchema, type NewTrailSchema } from '../../schemas/new-trail-schema';

type TrailBaseFormProps = {
  defaultValues?: NewTrailSchema;
  onSubmit: SubmitHandler<NewTrailSchema>;
  className?: ClassValue;
};

export function TrailBaseForm({ defaultValues, onSubmit, className }: TrailBaseFormProps) {
  const form = useForm<NewTrailSchema>({
    resolver: zodResolver(newTrailSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-8 w-full', className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Trilha tal" {...field} />
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
                <Input placeholder="Alguma descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <ImageUploaderInput
                  endpoint="newImageMedia"
                  value={form.watch('thumbnail')}
                  setValue={form.setValue.bind(form, 'thumbnail')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" isLoading={form.formState.isSubmitting}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}
