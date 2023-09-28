'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { PencilIcon } from 'lucide-react';
import type { NewTopicSchema } from '../../schemas/new-topic-schema';
import { type Topic } from '../../types/topic';
import { TopicBaseForm } from '../topic-base-form';
import { editTopicAction } from './edit-topic-action';

type EditTopicDialogTriggerProps = {
  topic: Topic;
};

export function EditTopicDialogTrigger({ topic }: EditTopicDialogTriggerProps) {
  const { toast } = useToast();

  const onSubmit = async (data: NewTopicSchema) => {
    try {
      await editTopicAction({ topic: data, topicId: topic.id });
      toast({ title: 'Trilha editada com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao editar trilha',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

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
          <TopicBaseForm defaultValues={topic} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
