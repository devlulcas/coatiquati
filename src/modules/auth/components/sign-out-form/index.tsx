import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';
import { AuthForm } from '../auth-form';

type SignOutFormProps = {
  children: React.ReactNode;
  className?: ClassValue;
  formClassName?: ClassValue;
};

export function SignOutForm({ children, className, formClassName }: SignOutFormProps) {
  return (
    <AuthForm action="/api/sign-out" className={cn(formClassName)}>
      <button className={cn(className)} type="submit">
        {children}
      </button>
    </AuthForm>
  );
}
