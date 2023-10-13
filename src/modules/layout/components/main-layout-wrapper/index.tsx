type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayoutWrapper({ children }: MainLayoutProps) {
  return <div className="min-h-[100dvh] backdrop-blur-xl">{children}</div>;
}
