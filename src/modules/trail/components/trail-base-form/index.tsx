'use client';

import { CategoriesAsyncSelect } from '@/modules/category/components/categories-async-select';
import { ImageUploadArea } from '@/modules/file/components/image-upload-area';
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
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ClassValue } from 'clsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  type UpsertTrailSchema,
  upsertTrailSchema,
} from '../../schemas/new-trail-schema';
import type { Trail } from '../../types/trail';

type TrailBaseFormProps = {
  defaultValues?: Trail;
  onSubmit: SubmitHandler<UpsertTrailSchema>;
  className?: ClassValue;
};

export function TrailBaseForm({
  defaultValues,
  onSubmit,
  className,
}: TrailBaseFormProps) {
  const form = useForm<UpsertTrailSchema>({
    resolver: zodResolver(upsertTrailSchema),
    defaultValues: {
      description: defaultValues?.description ?? '',
      thumbnail: defaultValues?.thumbnail ?? '',
      title: defaultValues?.title ?? '',
      categoryId: defaultValues?.category?.id,
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
          name="categoryId"
          render={() => {
            const categoryId = form.watch('categoryId');

            return (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <CategoriesAsyncSelect
                    selectedCategory={
                      categoryId ? { id: categoryId } : undefined
                    }
                    setSelectedCategory={(category) => {
                      form.setValue('categoryId', category.id);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
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
                  onFailedUpload={(error) => {
                    form.setError('thumbnail', error);
                  }}
                  onSuccessfulUpload={(data) => {
                    form.setValue('thumbnail', data.url);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          isLoading={form.formState.isSubmitting}
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}
