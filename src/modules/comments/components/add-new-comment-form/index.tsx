'use client';

import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import { toast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertOctagonIcon, SendIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { commentOnContentMutation } from '../../actions/comment-on-content-mutation';
import { newCommentSchema } from '../../schemas/new-comment-schema';
import { CircularProgress } from './circular-progress';

const formSchema = newCommentSchema;

type AddNewCommentFormValues = z.infer<typeof formSchema>;

type AddNewCommentFormProps = {
  contentId: number;
  parentCommentId?: number | null | undefined;
};

export function AddNewCommentForm({ contentId, parentCommentId }: AddNewCommentFormProps) {
  const form = useForm<AddNewCommentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentId,
      parentCommentId,
    },
  });

  const createCommentMutationState = useServerActionMutation({
    serverAction: commentOnContentMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao comentar',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({ title: 'Seu comentário foi publicado com sucesso' });
    },
  });

  const currentUserDataQuery = useCurrentUserDataQuery();

  const content = form.watch('content') ?? '';

  const maximumContentLength = 100;

  const overflowingText = useMemo(() => content.slice(maximumContentLength), [content]);

  if (typeof currentUserDataQuery.data === 'undefined') {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createCommentMutationState.mutate)} className="w-full space-y-4">
        {createCommentMutationState.state === 'error' && (
          <Alert variant="destructive">
            <AlertOctagonIcon className="h-4 w-4" />
            <AlertTitle>Algo deu errado!</AlertTitle>
            <AlertDescription>{createCommentMutationState.error.message}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {parentCommentId ? 'Comentário resposta' : 'Compartilhe sua opinião sobre o conteúdo'}
              </FormLabel>
              <FormControl>
                <div className="flex w-full flex-col items-start space-y-2 rounded-md border border-secondary/25 bg-secondary/30 p-1">
                  <div className="w-full">
                    <Textarea
                      placeholder="Dê um retorno sobre o conteúdo compatilhado..."
                      className="resize-none"
                      {...field}
                    />

                    {overflowingText.length > 0 && (
                      <p className="relative mt-2 rounded border border-destructive bg-destructive/30 p-2 text-red-600">
                        {overflowingText}

                        <span className="absolute right-1 top-1/2 -translate-y-1/2 rounded bg-destructive/50 px-2 py-1 text-white">
                          {overflowingText.length} acima do limite
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm">
                      {content.length} / {maximumContentLength}
                    </span>

                    <CircularProgress size={30} width={6} max={maximumContentLength} value={content.length} />

                    <Button
                      type="submit"
                      isLoading={createCommentMutationState.isPending}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      Enviar
                      <SendIcon size={16} />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
