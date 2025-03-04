import { cn } from '@/shared/utils/cn';

type MainLayoutProps = {
  children: React.ReactNode;
  blur?: 'xl' | 'none';
};

export function MainLayoutWrapper({ children, blur }: MainLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-[100dvh] overflow-x-hidden bg-black/50 backdrop-blur-xl before:absolute before:inset-0 before:z-[-1] before:bg-[url(/grainy.svg)] after:absolute after:inset-0 after:z-[-1] after:bg-[url(/grainy.svg)]',
        {
          'backdrop-blur-none': blur === undefined || blur === 'none',
          'backdrop-blur-xl': blur === 'xl',
        },
      )}
    >
      {children}
    </div>
  );
}
