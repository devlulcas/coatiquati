'use client';

import { toast } from '@/shared/components/ui/use-toast';
import { cn } from '@/shared/utils/cn';
import { useMutation } from '@tanstack/react-query';
import type { ClassValue } from 'clsx';
import { authClient } from '../lib/auth-client';

type SignOutFormProps = {
  children: React.ReactNode;
  className?: ClassValue;
};

export function SignOutForm({ children, className }: SignOutFormProps) {
  const action = useMutation({
    mutationFn: () => {
      return authClient.signOut();
    },
    onSuccess: () => {
      toast({
        title: 'Até a próxima :)',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao sair',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
  });

  return (
    <button
      className={cn(className)}
      disabled={action.isPending}
      onClick={() => action.mutate()}
      title="Sair"
      type="button"
    >
      {children}
    </button>
  );
}
