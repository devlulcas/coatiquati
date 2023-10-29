'use client';

import { ContentStatusBadge } from '@/modules/content/components/content-status-badge';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { contentStatus } from '@/shared/constants/content-status';
import { useTransition } from 'react';
import type { Trail } from '../../types/trail';
import { toggleTrailStatusAction } from './toggle-trail-status-action';

type ToggleTrailStatusFormProps = {
  trail: Trail;
};

export function ToggleTrailStatusForm({ trail }: ToggleTrailStatusFormProps) {
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await toggleTrailStatusAction(trail);
        toast({ title: `${trail.title} teve ser estado de publicação invertido` });
      } catch (error) {
        toast({
          title: 'Erro ao alterar estado de publicação da trilha',
          description: error instanceof Error ? error.message : String(error),
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <ContentStatusBadge status={trail.status} />
      <Button isLoading={isLoading} onClick={onSubmit}>
        {trail.status === contentStatus.PUBLISHED ? 'Omitir' : 'Publicar'}
      </Button>
    </div>
  );
}
