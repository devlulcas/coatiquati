import { getFeedbackListQuery } from '@/modules/feedback/actions/get-feedback-list-query';
import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { UserRoleBadge } from '@/modules/user/components/user-role-badge';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, MailIcon, SkullIcon, TrashIcon } from 'lucide-react';
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

  const fromDateTimeToLocaleString = (dateTime: string | Date) => {
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
            <li key={feedback.id} className="flex flex-col gap-4 rounded-2xl bg-foreground/10 px-2 py-2">
              <div className="mb-2 flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="space-y-2">
                    {feedback.user && (
                      <Link href={`/profile/${feedback.user.username}`} className="flex items-center gap-2">
                        <UserAvatar user={feedback.user} />
                        <p>{feedback.user.username}</p>
                        <UserRoleBadge role={feedback.user.role} />

                        {feedback.user.verified && (
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15"
                            title="Usuário verificado"
                            aria-label="Usuário verificado"
                          >
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          </span>
                        )}

                        {feedback.user.isBanned && (
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15"
                            title="Usuário banido"
                            aria-label="Usuário banido"
                          >
                            <SkullIcon className="h-4 w-4 text-red-500" />
                          </span>
                        )}
                      </Link>
                    )}

                    <a className="flex items-center gap-2" href={`mailto:${feedback.user.email}`}>
                      <MailIcon className="h-4 w-4 text-primary-foreground" />
                      {feedback.user.email}
                    </a>
                  </div>

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

                <FeedbackBadge variant={feedback.type} />
              </div>

              <ReadonlyEditor content={JSON.parse(feedback.content)} />
            </li>
          ))}
        </ul>

        {feedback.length === 0 && <p className="text-center text-muted-foreground">Nenhum feedback encontrado</p>}
      </section>
    </div>
  );
}

const feebackBadgeVariants = cva(
  'block h-fit min-w-28 rounded-b-3xl rounded-tl-3xl rounded-tr-lg px-3 py-2 text-center text-xs font-bold uppercase',
  {
    variants: {
      variant: {
        bug: 'bg-red-500/75 text-white',
        feature: 'bg-green-500/75 text-white',
        improvement: 'bg-blue-500/75 text-white',
      },
    },
    defaultVariants: {
      variant: 'bug',
    },
  },
);

type FeedbackBadgeProps = VariantProps<typeof feebackBadgeVariants>;

function FeedbackBadge({ variant }: FeedbackBadgeProps) {
  const feedbackTypeLabel: Record<string, string> = {
    bug: 'Bug',
    feature: 'Feature',
    improvement: 'Melhoria',
  };

  return <strong className={feebackBadgeVariants({ variant })}>{feedbackTypeLabel[variant ?? 'bug']}</strong>;
}
