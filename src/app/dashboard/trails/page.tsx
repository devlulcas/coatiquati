import { type TrailSearchSchema } from '@/modules/trail/actions/get-trails-query';
import { DashboardTrailForm } from '@/modules/trail/components/dashboard-trail-form-search';
import { DashboardTrailResultView } from '@/modules/trail/components/dashboard-trail-result-view';

type PageProps = {
  searchParams: Record<keyof TrailSearchSchema, string>;
};

export default function Page({ searchParams }: PageProps) {
  return (
    <main className="container py-8">
      <DashboardTrailForm />
      <DashboardTrailResultView searchParams={searchParams} />
    </main>
  );
}
