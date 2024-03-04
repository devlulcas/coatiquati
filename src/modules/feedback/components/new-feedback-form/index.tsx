'use client';

import { Editor } from '@/modules/rich-text-content/components/editor';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewFeedbackMutation } from '../../actions/create-new-feedback-mutation';

export const formSchema = z.object({
  type: z.union([z.literal('bug'), z.literal('feature'), z.literal('improvement')]),
  text: z.any(),
});

export type NewFeedbackFormValues = z.infer<typeof formSchema>;

export function NewFeedbackForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<NewFeedbackFormValues>({
    resolver: zodResolver(formSchema),
  });

  const createNewFeedbackMutationState = useServerActionMutation({
    serverAction: createNewFeedbackMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao criar feedback',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      router.push('/feedback/thanks');
    },
    shouldRefresh: false,
  });

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(createNewFeedbackMutationState.mutate)}
        className="flex h-fit min-w-[400px] max-w-6xl flex-col gap-4 rounded-md border bg-card px-4 py-6 shadow-md"
        action="/api/sign-up"
      >
        <h1 className="text-3xl font-bold">Feedback</h1>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de feedback</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de feedback" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="improvement">Melhoria</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Selecione o tipo de feedback que você deseja enviar.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <Editor
          onDelayedChange={editor => {
            form.setValue('text', JSON.parse(JSON.stringify(editor.getJSON())));
          }}
        />

        <Button className="mt-4 w-full" type="submit" isLoading={form.formState.isSubmitting}>
          Enviar
        </Button>
      </form>
    </Form>
  );
}
