'use client';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';

type EditorActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  active?: boolean;
  className?: ClassValue;
};

export function EditorActionButton({ icon, label, onClick, disabled, active, className }: EditorActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={cn(
        'h-fit min-w-fit flex-1 gap-2 rounded-none border px-2 py-2',
        { 'bg-brand-500 text-brand-50 hover:text-brand-600': active },
        className,
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );
}
