import { NewTrailForm } from '@/modules/trail/components/new-trail-form';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  return (
    <div className="rounded border bg-background/75 p-4 backdrop-blur-md">
      <NewTrailForm />

      <Button asChild className="mt-2" variant="secondary">
        <Link href="/dashboard">Voltar</Link>
      </Button>
    </div>
  );
}
