'use client';

import { useUpsertTrail } from '../../hooks/use-upsert-trail';
import { TrailBaseForm } from '../trail-base-form';

export function NewTrailForm() {
  const mutation = useUpsertTrail();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">
        {mutation.isPending ? 'Criando' : 'Criar'} nova trilha
      </h2>
      <TrailBaseForm onSubmit={(data) => mutation.mutateAsync(data)} />
    </div>
  );
}
