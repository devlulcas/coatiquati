'use client';

import { ContentStatusBadge } from '@/modules/content/components/content-status-badge';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { contentStatus } from '@/shared/constants/content-status';
import { useTransition } from 'react';
import { toggleTrailStatusMutation } from '../../actions/toggle-trail-status-mutation';
import type { Trail } from '../../types/trail';

type ToggleTrailStatusFormProps = {
  trail: Trail;
};

export function ToggleTrailStatusForm({ trail }: ToggleTrailStatusFormProps) {
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await toggleTrailStatusMutation(trail);
        toast({ title: `${trail.title} teve seu estado de publicação invertido` });
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
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        type="button"
        isLoading={isLoading}
        className="flex items-center gap-2"
        onClick={onSubmit}
      >
        <ContentStatusBadge status={trail.status} />
        {trail.status === contentStatus.PUBLISHED ? 'Omitir' : 'Publicar'}
      </Button>
    </div>
  );
}
