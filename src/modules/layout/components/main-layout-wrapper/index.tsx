type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayoutWrapper({ children }: MainLayoutProps) {
  return (
    <div className="min-h-[100dvh] backdrop-blur-xl bg-black/50 before:absolute before:inset-0 before:bg-[url(/grainy.svg)] before:z-[-1] after:absolute after:inset-0 after:bg-[url(/grainy.svg)] after:z-[-1]">
      {children}
    </div>
  );
}
