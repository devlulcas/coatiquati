import { type TrailSearchSchema } from '@/modules/trail/actions/get-trails-query';
import { DashboardTrailForm } from '@/modules/trail/components/dashboard-trail-form-search';
import { DashboardTrailResultView } from '@/modules/trail/components/dashboard-trail-result-view';

type PageProps = {
  searchParams: Promise<Record<keyof TrailSearchSchema, string>>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  return (
    <main className="container py-8">
      <DashboardTrailForm />
      <DashboardTrailResultView searchParams={searchParams} />
    </main>
  );
}
