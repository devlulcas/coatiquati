import { getFeedbackListQuery } from '@/modules/feedback/actions/get-feedback-list-query';
import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
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

  return (
    <div className="flex flex-col gap-8">
      <section>
        <form className="flex gap-2">
          <Select defaultValue={type}>
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

        <ul className="flex flex-col gap-4 divide-y">
          {feedback.map(feedback => (
            <li key={feedback.id} className="flex gap-4 px-2 py-4">
              <div>
                <div className="mb-2 flex gap-2">
                  <h3
                    className={cn(
                      'rounded-md px-3 py-2 text-sm',
                      feedback.type === 'bug' && 'bg-red-500/75 text-white',
                      feedback.type === 'feature' && 'bg-green-500/75 text-white',
                      feedback.type === 'improvement' && 'bg-blue-500/75 text-white',
                    )}
                  >
                    {feedbackTypeLabel[feedback.type] ?? feedback.type}
                  </h3>

                  <time className="text-sm text-muted-foreground" dateTime={new Date(feedback.createdAt).toISOString()}>
                    {new Date(feedback.createdAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </time>
                </div>
                <ReadonlyEditor content={feedback.content} />
              </div>
            </li>
          ))}
        </ul>

        {feedback.length === 0 && <p className="text-center text-muted-foreground">Nenhum feedback encontrado</p>}
      </section>
    </div>
  );
}
