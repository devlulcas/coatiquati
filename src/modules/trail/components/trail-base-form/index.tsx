'use client';

import { CategoriesAsyncSelect } from '@/modules/category/components/categories-async-select';
import { ImageUploadArea } from '@/modules/file/components/image-upload-area';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ClassValue } from 'clsx';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { newTrailSchema, type NewTrailSchema } from '../../schemas/new-trail-schema';
import type { Trail } from '../../types/trail';

type TrailBaseFormProps = {
  defaultValues?: Trail;
  onSubmit: SubmitHandler<NewTrailSchema>;
  className?: ClassValue;
};

export function TrailBaseForm({ defaultValues, onSubmit, className }: TrailBaseFormProps) {
  const form = useForm<NewTrailSchema>({
    resolver: zodResolver(newTrailSchema),
    defaultValues: {
      category: defaultValues?.category?.name,
      description: defaultValues?.description,
      status: defaultValues?.status,
      thumbnail: defaultValues?.thumbnail,
      title: defaultValues?.title,
    },
  });

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex w-full flex-col gap-4', className)}
      >
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
          name="category"
          render={() => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <CategoriesAsyncSelect
                  selectedCategory={{ name: form.watch('category') || '' }}
                  setSelectedCategory={category => form.setValue('category', category.name)}
                />
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
                <ImageUploadArea
                  defaultValue={{ src: field.value }}
                  onFailedUpload={error => {
                    form.setError('thumbnail', error);
                  }}
                  onSuccessfulUpload={data => {
                    form.setValue('thumbnail', data.url);
                  }}
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
