'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer';
import { useToast } from '@/shared/components/ui/use-toast';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquarePlusIcon } from 'lucide-react';
import { memo, useState } from 'react';
import type { Comment } from '../../types/comment';
import { AddNewCommentForm } from '../add-new-comment-form';

type AnswerCommentDrawerTriggerProps = {
  originalComment: Comment;
};

function InnerAnswerCommentDrawerTrigger({ originalComment }: AnswerCommentDrawerTriggerProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="items-center gap-2">
            <span>Responder</span>
            <MessageSquarePlusIcon size={16} />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Responser a comentário de {originalComment.author.username}</DialogTitle>
            <DialogDescription>Seja legal!</DialogDescription>
          </DialogHeader>

          <AddNewCommentForm contentId={originalComment.contentId} parentCommentId={originalComment.id} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline" className="w h-9 w-9 items-center gap-2">
          <span className="sr-only">Responder</span>
          <MessageSquarePlusIcon size={16} />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-lg py-10">
          <DrawerHeader>
            <DrawerTitle>Responser a comentário de {originalComment.author.username}</DrawerTitle>
            <DrawerDescription>Seja legal!</DrawerDescription>
          </DrawerHeader>

          <AddNewCommentForm contentId={originalComment.contentId} parentCommentId={originalComment.id} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

async function postResponse(commentId: number, content: string): Promise<{ message: string }> {
  const response = await fetch(`/api/comments/${commentId}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  const createdResponse: { message: string } | { error: string } = await response.json();

  if ('error' in createdResponse) {
    throw new Error(createdResponse.error);
  }

  return createdResponse;
}

function usePostCommentResponseMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => postResponse(commentId, content),
    onError: error => {
      toast({
        title: 'Erro ao criar comentário',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    },
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: ['comment-responses', vars.commentId] });
    },
    onSuccess: data => {
      toast({
        title: 'Comentário respondido',
        description: data.message,
        variant: 'success',
      });
    },
  });
}

export const AnswerCommentDrawerTrigger = memo(InnerAnswerCommentDrawerTrigger);
