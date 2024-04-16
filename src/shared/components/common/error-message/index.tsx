import { cn } from '@/shared/utils/cn';

type ErrorMessageProps = {
  message: string;
  className?: string;
};

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <p className={cn('rounded border border-destructive bg-destructive/50 p-4 text-destructive-foreground', className)}>
      {message}
    </p>
  );
}
