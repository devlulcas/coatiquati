'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { PencilIcon } from 'lucide-react';
import { updateTopicMutation } from '../../actions/update-topic-mutation';
import { type Topic } from '../../types/topic';
import { TopicBaseForm } from '../topic-base-form';

type EditTopicDialogTriggerProps = {
  topic: Topic;
};

export function EditTopicDialogTrigger({ topic }: EditTopicDialogTriggerProps) {
  const { toast } = useToast();

  const mutation = useServerActionMutation({
    serverAction: updateTopicMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao atualizar tópico',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({
        title: 'Tópico atualizado com sucesso',
        variant: 'success',
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          Editar
          <PencilIcon size={16} className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle className="mb-4 max-w-xs truncate">Editar {topic.title}</DialogTitle>
          <TopicBaseForm
            defaultValues={{ ...topic, thumbnail: topic.thumbnail ?? '/images/placeholder.png' }}
            onSubmit={data => {
              mutation.mutate({
                ...data,
                id: topic.id,
                trailId: topic.trailId,
              });
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
