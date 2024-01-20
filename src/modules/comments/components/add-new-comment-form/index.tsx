'use client';

import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { UserAvatar } from '@/shared/components/common/user-avatar';
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

  const contentLength = form.watch('content')?.length ?? 0;
  const maximumContentLength = 180;
  const percentageOfContentFilled = useMemo(() => (contentLength / maximumContentLength) * 100, [contentLength]);

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
                  <div className="flex space-x-2 w-full">
                    <UserAvatar user={currentUserDataQuery.data} />

                    <Textarea
                      placeholder="Dê um retorno sobre o conteúdo compatilhado..."
                      className="resize-none"
                      {...field}
                    />
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <div className="border rounded-full w-8 h-8 bg-gray-50 flex items-center justify-center">
                      <div
                        style={{
                          width: `${percentageOfContentFilled}%`,
                          aspectRatio: '1/1',
                        }}
                        className="rounded-full bg-gray-500"
                      ></div>
                    </div>

                    <Button type="submit" className="flex items-center gap-2">
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
