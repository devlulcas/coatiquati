'use client';

import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import { toast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { SendIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { COMMENTS_QUERY_KEY } from '../../hooks/use-comments-query';
import { newCommentSchema } from '../../schemas/new-comment-schema';
import { addNewCommentAction } from './add-new-comment-action';
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

  const queryClient = useQueryClient();

  const onSubmit = async (data: AddNewCommentFormValues) => {
    try {
      await addNewCommentAction(data);
      toast({ title: 'Seu comentário foi publicado com sucesso' });
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY, contentId, parentCommentId] });
    } catch (error) {
      toast({
        title: 'Erro ao comentar',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  const currentUserDataQuery = useCurrentUserDataQuery();

  const content = form.watch('content') ?? '';

  const maximumContentLength = 100;

  const overflowingText = useMemo(() => content.slice(maximumContentLength), [content]);

  if (typeof currentUserDataQuery.data === 'undefined') {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {parentCommentId ? 'Comentário resposta' : 'Compartilhe sua opinião sobre o conteúdo'}
              </FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-2 items-start border border-secondary/25 bg-secondary/30 rounded-md p-1 w-full">
                  <div className="w-full">
                    <Textarea
                      placeholder="Dê um retorno sobre o conteúdo compatilhado..."
                      className="resize-none"
                      {...field}
                    />

                    {overflowingText.length > 0 && (
                      <p className="text-red-600 mt-2 p-2 bg-destructive/30 border border-destructive rounded relative">
                        {overflowingText}

                        <span className="absolute top-1/2 -translate-y-1/2 right-1 bg-destructive/50 text-white px-2 py-1 rounded">
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

                    <Button type="submit" className="flex items-center gap-2" size="sm">
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
