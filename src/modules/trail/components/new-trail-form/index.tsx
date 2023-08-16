'use client';

import { TrailBaseForm } from '../trail-base-form';

export function NewTrailForm() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">Criar nova trilha</h2>
      <TrailBaseForm onSubmit={(data) => console.log(data)} />
    </div>
  );
}
