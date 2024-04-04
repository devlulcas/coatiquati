'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { PlusIcon } from 'lucide-react';
import { createTopicMutation } from '../../actions/create-topic-mutation';
import { TopicBaseForm } from '../topic-base-form';

type NewTopicDialogTriggerProps = {
  trailId: number;
};

export function NewTopicDialogTrigger({ trailId }: NewTopicDialogTriggerProps) {
  const { toast } = useToast();

  const mutation = useServerActionMutation({
    serverAction: createTopicMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao criar tópico',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({
        title: 'Tópico criado com sucesso',
        variant: 'success',
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          Criar novo tópico
          <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle className="mb-4 max-w-xs truncate">Criar novo tópico</DialogTitle>
          <TopicBaseForm defaultValues={{ trailId }} onSubmit={mutation.mutate} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
