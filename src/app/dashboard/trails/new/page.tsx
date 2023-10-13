import { NewTrailForm } from '@/modules/trail/components/new-trail-form';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  return (
    <div className="bg-background/75 border p-4 rounded backdrop-blur-md">
      <NewTrailForm />

      <Button asChild className="mt-2" variant="secondary">
        <Link href="/dashboard">Voltar</Link>
      </Button>
    </div>
  );
}
