type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayoutWrapper({ children }: MainLayoutProps) {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black/50 backdrop-blur-xl before:absolute before:inset-0 before:z-[-1] before:bg-[url(/grainy.svg)] after:absolute after:inset-0 after:z-[-1] after:bg-[url(/grainy.svg)]">
      {children}
    </div>
  );
}
