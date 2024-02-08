'use client';

import { Editor } from '@/modules/rich-text-content/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { newFeedbackAction } from './new-feedback-action';

export const formSchema = z.object({
  feedback: z.any(),
});

export type NewFeedbackFormValues = z.infer<typeof formSchema>;

export function NewFeedbackForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<NewFeedbackFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: NewFeedbackFormValues) => {
    try {
      await newFeedbackAction(data);
      toast({ title: 'Feedback criado com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao enviar feedback',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };
  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 h-fit bg-card border rounded-md shadow-md px-4 py-6 min-w-[400px] max-w-6xl"
        action="/api/sign-up"
      >
        <h1 className="text-3xl font-bold">Feedback</h1>
        <Editor
          onDelayedChange={editor => {
            form.setValue('feedback', JSON.parse(JSON.stringify(editor.getJSON())));
          }}
        />

        <Button className="w-full mt-4" type="submit" isLoading={form.formState.isSubmitting}>
          Entrar
        </Button>
      </form>
    </Form>
  );
}
