'use client';

import { VideoContentBaseForm } from '@/modules/video-content/components/video-content-base-form';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { useState } from 'react';
import { createNewVideoContentMutation } from '../../actions/create-new-video-content-mutation';

type NewVideoContentDialogTriggerProps = {
  topicId: number;
  children: React.ReactNode;
};

export function NewVideoContentDialogTrigger({ topicId, children }: NewVideoContentDialogTriggerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const createNewVideoContentMutationState = useServerActionMutation({
    serverAction: createNewVideoContentMutation,
    onSuccessfulAction: newVideo => {
      toast({
        title: 'Conteúdo de vídeo criado com sucesso',
        description: `"${newVideo.description.toUpperCase()}" foi adicionado a lista de vídeos com sucesso.`,
        variant: 'success',
      });

      setIsOpen(false);
    },
    onFailedAction: error => {
      toast({
        title: 'Erro ao criar conteúdo de vídeo criado',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-fit">
        <VideoContentBaseForm defaultValues={{ topicId }} onSubmit={createNewVideoContentMutationState.mutate} />
      </DialogContent>
    </Dialog>
  );
}
