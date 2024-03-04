import { getFeedbackListQuery } from '@/modules/feedback/actions/get-feedback-list-query';
import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cn } from '@/shared/utils/cn';
import { TrashIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams: {
    type?: string;
    page?: string;
  };
};

export default async function FeedbackPage(props: PageProps) {
  const page = props.searchParams.page ? parseInt(props.searchParams.page) : 1;
  const type = props.searchParams.type;

  const feedback = await getFeedbackListQuery(page, type);

  const feedbackTypeLabel: Record<string, string> = {
    bug: 'Bug',
    feature: 'Feature',
    improvement: 'Melhoria',
  };

  const fromDateTimeToLocaleString = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <form className="flex gap-2">
          <Select defaultValue={type} name="type" aria-label="Tipo de feedback">
            <SelectTrigger>
              <SelectValue placeholder="Tipo de feedback" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="improvement">Melhoria</SelectItem>
            </SelectContent>
          </Select>

          <Button>Buscar</Button>

          <Button title="Limpar filtros" aria-label="Limpar filtros" variant="destructive" size="icon" asChild>
            <Link href="/dashboard/feedback">
              <TrashIcon className="h-4 w-4" />
            </Link>
          </Button>
        </form>

        <ul className="mt-4 flex flex-col divide-y divide-primary/15 overflow-clip rounded">
          {feedback.map(feedback => (
            <li key={feedback.id} className="flex flex-col gap-4 bg-foreground/10 px-2 py-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {feedback.user && (
                    <Link href={`/profile/${feedback.user.username}`}>
                      <UserAvatar user={feedback.user} />
                    </Link>
                  )}

                  <div>
                    <h3 className="text-xl font-bold">{feedback.softwareVersion}</h3>
                    <time
                      className="text-sm text-muted-foreground"
                      dateTime={new Date(feedback.createdAt).toISOString()}
                    >
                      {fromDateTimeToLocaleString(feedback.createdAt)}
                    </time>
                  </div>
                </div>

                <strong
                  className={cn(
                    'min-w-28 rounded-full px-3 py-2 text-center text-xs font-bold uppercase',
                    feedback.type === 'bug' && 'bg-red-500/75 text-white',
                    feedback.type === 'feature' && 'bg-green-500/75 text-white',
                    feedback.type === 'improvement' && 'bg-blue-500/75 text-white',
                  )}
                >
                  {feedbackTypeLabel[feedback.type] ?? feedback.type}
                </strong>
              </div>

              <ReadonlyEditor content={feedback.text} />
            </li>
          ))}
        </ul>

        {feedback.length === 0 && <p className="text-center text-muted-foreground">Nenhum feedback encontrado</p>}
      </section>
    </div>
  );
}
