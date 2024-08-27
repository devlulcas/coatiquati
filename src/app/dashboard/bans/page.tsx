import { getReportsQuery } from '@/modules/user-moderation/actions/get-reports-query';
import ReportListItem from '@/modules/user-moderation/components/report-list-item';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { isFail } from '@/shared/lib/result';
import { TrashIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams: {
    user?: string;
  };
};

export default async function Page(props: PageProps) {
  const reportsResult = await getReportsQuery();

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

        {isFail(reportsResult) ? (
          <ErrorMessage message={reportsResult.fail} className="mt-4" />
        ) : (
          <ul className="mt-4 flex flex-col gap-1 divide-y-2">
            {reportsResult.value.map(report => (
              <ReportListItem key={report.id} report={report} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
