import { ReportFormDialogTrigger } from '@/modules/user-moderation/components/report-form-dialog-trigger';
import { ContributorList } from '@/modules/user/components/contributor-list';
import { UpdatedAt } from '@/shared/components/common/updated-at';
import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';
import { createTopicUrl } from '../../lib/create-topic-url';
import type { Topic } from '../../types/topic';

type TopicCardItemProps = {
  topic: Topic;
};

export function TopicCardItem({ topic }: TopicCardItemProps) {
  const allContributors = [topic.author, ...topic.contributors.map(contributor => contributor.user)];

  return (
    <Link
      href={createTopicUrl(topic.id, topic.trailId)}
      className="flex flex-col gap-2 rounded-md border bg-card/90 p-4 text-card-foreground shadow-md transition-all hover:shadow-lg"
    >
      <h3 className="truncate whitespace-break-spaces break-words text-xl font-bold">{topic.title}</h3>

      <p className="truncate whitespace-break-spaces break-words text-sm">{topic.description}</p>

      <section className="relative flex items-center gap-2">
        <ContributorList contributors={allContributors} />

        <span className="text-sm text-foreground/50">•</span>

        <span className="text-sm">
          {allContributors.length === 1 ? '1 contribuidor' : `${allContributors.length} contribuidores`}
        </span>

        <ReportFormDialogTrigger origin={{ id: topic.id, type: 'topic' }} user={topic.author.id}>
          <div className="relative ml-auto flex h-[1ch] w-[2.5ch] items-center justify-center">
            <button
              type="button"
              aria-label="Mais opções"
              title="Mais opções"
              className="absolute flex h-10 w-10 items-center justify-center rounded-full text-sm text-brand-50 hover:bg-brand-800/50 focus:bg-brand-800/50"
            >
              <EllipsisIcon size={16} />
            </button>
          </div>
        </ReportFormDialogTrigger>
      </section>

      <UpdatedAt updatedAt={topic.updatedAt} />
    </Link>
  );
}
