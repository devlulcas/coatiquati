'use client';

import { Editor } from '@/modules/rich-text-content/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const feedbackSchema = z.object({
  username: z
    .string({ required_error: 'O nome de usuário é obrigatório' })
    .min(4, { message: 'O nome de usuário deve ter pelo menos 4 caracteres' })
    .max(31, { message: 'O nome de usuário deve ter no máximo 31 caracteres' }),
  feedback: z.any(),
});

export default function FeedbackPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    const formData = new FormData();

    formData.append('username', values.username);

    const response = await fetch('/api/sign-up', {
      method: 'POST',
      body: formData,
      redirect: 'manual',
    });

    if (response.status === 0) {
      toast({
        title: 'Sucesso',
        description: 'Bem vindo!',
      });

      return router.refresh();
    }

    return toast({
      title: 'Erro',
      description: 'Ocorreu um erro inesperado. Talvez esse usuário já exista',
      variant: 'destructive',
    });
  };

  return (
    <div className="h-[--view-height] w-full flex items-center justify-center">
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 h-fit bg-card border rounded-md shadow-md px-4 py-6 min-w-[400px] max-w-6xl"
          action="/api/sign-up"
        >
          <h1 className="text-3xl font-bold">Feedback</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input placeholder="@exemplo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </div>
  );
}
