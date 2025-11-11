'use client';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { unwrap } from '@/shared/lib/result';
import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { ignoreReportMutation } from '../actions/ignore-report-mutation';

type IgnoreReportButtonProps = {
  reportId: number;
};

export function IgnoreReportButton({ reportId }: IgnoreReportButtonProps) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      return unwrap(await ignoreReportMutation(reportId));
    },
    onSuccess: () => {
      toast({ title: `Reporte ignorado` });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao ignorar reporte',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <Button
      className="items-center space-x-2"
      size="sm"
      variant="destructive"
      onClick={() => mutation.mutate()}
      type="button"
    >
      Rejeitar <TrashIcon className="h-4 w-4" />
    </Button>
  );
}
