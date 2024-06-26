'use client';

import { ContentStatusBadge } from '@/modules/content/components/content-status-badge';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { contentStatus } from '@/shared/constants/content-status';
import { useTransition } from 'react';
import { toggleTopicStatusMutation } from '../../actions/toggle-topic-status-mutation';
import type { Topic } from '../../types/topic';

type ToggleTopicStatusFormProps = {
  topic: Topic;
};

export function ToggleTopicStatusForm({ topic }: ToggleTopicStatusFormProps) {
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await toggleTopicStatusMutation(topic.id);
        toast({ title: `${topic.title} teve seu estado de publicação invertido` });
      } catch (error) {
        toast({
          title: 'Erro ao alterar estado de publicação do tópico',
          description: error instanceof Error ? error.message : String(error),
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        type="button"
        isLoading={isLoading}
        className="flex items-center gap-2"
        onClick={onSubmit}
      >
        <ContentStatusBadge status={topic.status} />
        {topic.status === contentStatus.PUBLISHED ? 'Omitir' : 'Publicar'}
      </Button>
    </div>
  );
}
