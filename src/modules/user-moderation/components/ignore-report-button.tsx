'use client';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { TrashIcon } from 'lucide-react';
import { ignoreReportMutation } from '../actions/ignore-report-mutation';

type IgnoreReportButtonProps = {
  reportId: number;
};

export function IgnoreReportButton({ reportId }: IgnoreReportButtonProps) {
  const { toast } = useToast();

  const mutation = useServerActionMutation({
    serverAction: ignoreReportMutation,
    onSuccessfulAction: () => {
      toast({ title: `Reporte ignorado` });
    },
    onFailedAction: error => {
      toast({
        title: 'Erro ao ignorar reporte',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
  });

  return (
    <Button
      className="items-center space-x-2"
      size="sm"
      variant="destructive"
      onClick={() => mutation.mutate(reportId)}
      type="button"
    >
      Rejeitar <TrashIcon className="h-4 w-4" />
    </Button>
  );
}
