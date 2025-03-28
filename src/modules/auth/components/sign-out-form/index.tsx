'use client';

import { useToast } from '@/shared/components/ui/use-toast';
import { fail, isFail, isOk } from '@/shared/lib/result';
import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';
import { useEffect, useActionState } from 'react';
import { logoutMutation } from '../../actions/logout-mutation';

type SignOutFormProps = {
  children: React.ReactNode;
  className?: ClassValue;
  formClassName?: ClassValue;
};

export function SignOutForm({ children, className, formClassName }: SignOutFormProps) {
  const [state, formAction, isPending] = useActionState(logoutMutation, fail('undefined'));

  const { toast } = useToast();

  useEffect(() => {
    if (isFail(state)) {
      toast({
        title: state.fail,
        variant: 'destructive',
      });
    }

    if (isOk(state)) {
      toast({
        title: 'Até a próxima :)',
        variant: 'success',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className={cn(formClassName)}>
      <button className={cn(className)} type="submit" disabled={isPending}>
        {children}
      </button>
    </form>
  );
}
