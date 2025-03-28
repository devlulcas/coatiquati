import { cn } from '@/shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const variants = cva('p-4 items-center justify-center rounded border', {
  variants: {
    variant: {
      destructive: 'border-destructive bg-destructive/50 text-destructive-foreground',
      warning: 'border-warning bg-warning/50 text-warning-foreground',
      info: 'border-info bg-info/50 text-info-foreground',
    },
  },
  defaultVariants: {
    variant: 'destructive',
  },
});

type AppFeedbackCardProps = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof variants>;

export function AppFeedbackCard({ children, className, variant }: AppFeedbackCardProps) {
  return (
    <div className={cn(variants({ variant, className }))}>
      <p className="text-pretty font-bold">
        {children}
      </p>
    </div>
  );
}
