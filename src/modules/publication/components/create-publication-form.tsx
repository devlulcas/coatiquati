'use client';

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
import { Textarea } from '@/shared/components/ui/textarea';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { publishContentMutation } from '../actions/publish-content-mutation';
import { createPublicationSchema, type CreatePublicationSchema } from '../schemas/create-publication';

export function CreatePublicationForm() {
  const { toast } = useToast();

  const form = useForm<CreatePublicationSchema>({
    resolver: zodResolver(createPublicationSchema),
  });

  const mutation = useServerActionMutation({
    serverAction: publishContentMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao criar publicação',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({
        title: 'Publicação criada',
        description: 'Sua publicação foi criada com sucesso!',
        variant: 'success',
      });
    },
    shouldRefresh: true,
  });

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(mutation.mutate)}
        className="flex h-fit w-full flex-col gap-4 rounded-md border bg-card/75 p-4 shadow-md"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publique algo sobre seus estudos</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>O conteúdo deve ter no máximo 1000 caracteres</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-4 w-full" type="submit" isLoading={form.formState.isSubmitting}>
          Enviar
        </Button>
      </form>
    </Form>
  );
}
