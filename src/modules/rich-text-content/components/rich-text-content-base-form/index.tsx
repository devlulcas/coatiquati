'use client';

import { Editor } from '@/modules/rich-text-content/components/editor';
import {
  newRichTextContentSchema,
  type NewRichTextContentSchema,
} from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ClassValue } from 'clsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';

const newRichTextContentFormSchema = newRichTextContentSchema;
type NewRichTextContentFormSchema = z.infer<typeof newRichTextContentFormSchema>;

type RichTextContentBaseFormProps = {
  defaultValues?: Partial<NewRichTextContentSchema>;
  onSubmit: SubmitHandler<NewRichTextContentSchema>;
  className?: ClassValue;
};

export function RichTextContentBaseForm(props: RichTextContentBaseFormProps) {
  const { defaultValues, onSubmit, className } = props;

  const form = useForm<NewRichTextContentFormSchema>({
    resolver: zodResolver(newRichTextContentFormSchema),
    defaultValues,
  });

  const innerOnSubmit = form.handleSubmit(data => {
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form method="POST" onSubmit={innerOnSubmit} className={cn('space-y-8 w-full', className)}>
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

        <Button className="w-full" type="submit" isLoading={form.formState.isSubmitting}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}
