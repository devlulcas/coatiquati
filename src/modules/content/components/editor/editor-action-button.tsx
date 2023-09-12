'use client';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

type EditorActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  active?: boolean;
};

export function EditorActionButton({
  icon,
  label,
  onClick,
  disabled,
  active,
}: EditorActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn('gap-2', { 'bg-brand-500 text-brand-50': active })}
    >
      {icon}
      {label}
    </Button>
  );
}
