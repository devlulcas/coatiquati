import { getReportsQuery } from '@/modules/user-moderation/actions/get-reports-query';
import ReportListItem from '@/modules/user-moderation/components/report-list-item';
import { REPORT_REASON_LABELS, type ReportReason } from '@/modules/user-moderation/constants/report';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { TrashIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams: {
    user?: string;
  };
};

export default async function Page(props: PageProps) {
  const reports = await getReportsQuery();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <form className="flex gap-2">
          <Input name="user" placeholder="Pesquisar por usuário" />
          <Button>Buscar</Button>
          <Button title="Limpar filtros" aria-label="Limpar filtros" variant="destructive" size="icon" asChild>
            <Link href="/dashboard/bans">
              <TrashIcon className="h-4 w-4" />
            </Link>
          </Button>
        </form>

        <ul className="mt-4 flex flex-col gap-1 divide-y-2">
          {reports.map(report => (
            <ReportListItem key={report.id} report={report} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function ReportReasonLabel({ reason }: { reason: ReportReason }) {
  return (
    <span className="rounded bg-destructive/75 px-2 text-sm text-destructive-foreground">
      {REPORT_REASON_LABELS[reason]}
    </span>
  );
}
