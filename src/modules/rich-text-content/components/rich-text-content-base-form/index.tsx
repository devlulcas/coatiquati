'use client';

import { Editor } from '@/modules/rich-text-content/components/editor';
import {
  newRichTextContentSchema,
  type NewRichTextContentSchema,
} from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ClassValue } from 'clsx';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

const newRichTextContentFormSchema = newRichTextContentSchema;
type NewRichTextContentFormSchema = z.infer<typeof newRichTextContentFormSchema>;

type RichTextContentBaseFormProps = {
  defaultValues?: Partial<NewRichTextContentSchema>;
  onSubmit: SubmitHandler<NewRichTextContentSchema>;
  className?: ClassValue;
};

export function RichTextContentBaseForm({ defaultValues, onSubmit, className }: RichTextContentBaseFormProps) {
  const form = useForm<NewRichTextContentFormSchema>({
    resolver: zodResolver(newRichTextContentFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className={cn('w-full space-y-8', className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite um título aqui" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Editor
          initialContent={defaultValues?.content}
          onDelayedChange={editor => {
            form.setValue('content', JSON.parse(JSON.stringify(editor.getJSON())));
          }}
        />

        {form.formState.errors.content && (
          <ErrorMessage message={form.formState.errors.content.message?.toString() ?? ''} />
        )}

        <Button
          onClick={() => {
            onSubmit({ ...form.getValues(), content: JSON.stringify(form.getValues().content) });
          }}
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
