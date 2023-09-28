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

export function EditorActionButton({
  icon,
  label,
  onClick,
  disabled,
  active,
  className,
}: EditorActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'gap-2 flex-1 whitespace-nowrap',
        { 'bg-brand-500 text-brand-50': active },
        className,
      )}
    >
      {icon}
      {label}
    </Button>
  );
}
