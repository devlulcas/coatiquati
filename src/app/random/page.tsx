import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random',
  robots: 'noindex, nofollow',
};

export default function Page() {
  return (
    <div className="fixed inset-0 z-[999] bg-background">
      <h1>Random</h1>
    </div>
  );
}
