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
import { PlusIcon } from 'lucide-react';
import type { NewTopicSchema } from '../../schemas/new-topic-schema';
import { TopicBaseForm } from '../topic-base-form';
import { newTopicAction } from './new-topic-action';

type NewTrailDialogTriggerProps = {
  trailId: number;
};

export function NewTrailDialogTrigger({ trailId }: NewTrailDialogTriggerProps) {
  const { toast } = useToast();

  const onSubmit = async (data: NewTopicSchema) => {
    try {
      await newTopicAction(data);
      toast({ title: 'Tópico criado com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao criar tópico',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

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
          <DialogTitle className="mb-4 max-w-xs truncate">
            Criar novo tópico
          </DialogTitle>
          <TopicBaseForm defaultValues={{ trailId }} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
