'use client';

import { ContentStatus } from '@/modules/database/schema/content';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useToast } from '@/shared/components/ui/use-toast';
import { Loader2Icon } from 'lucide-react';
import { useTransition } from 'react';
import { changeTrailContentStatusMutation } from '../../actions/toggle-trail-status-mutation';
import type { Trail } from '../../types/trail';

type ToggleTrailStatusFormProps = {
  trail: Trail;
};

export function ToggleTrailStatusForm({ trail }: ToggleTrailStatusFormProps) {
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const setStatus = (status: ContentStatus) => {
    startTransition(async () => {
      try {
        await changeTrailContentStatusMutation({ id: trail.id, status });
        toast({
          title: `${trail.title} teve seu estado de publicação invertido`,
        });
      } catch (error) {
        toast({
          title: 'Erro ao alterar estado de publicação da trilha',
          description: error instanceof Error ? error.message : String(error),
          variant: 'destructive',
        });
      }
    });
  };

  const statusOptions = [
    { value: ContentStatus.DRAFT, label: 'Rascunho' },
    { value: ContentStatus.PUBLISHED, label: 'Publicado' },
    { value: ContentStatus.ARCHIVED, label: 'Arquivado' },
  ];

  return (
    <Select
      value={trail.status.toString()}
      onValueChange={(value) => setStatus(Number(value))}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px]" disabled={isLoading}>
        {isLoading ? (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <SelectValue placeholder="Selecione o status" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statusOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              disabled={isLoading || trail.status === option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
