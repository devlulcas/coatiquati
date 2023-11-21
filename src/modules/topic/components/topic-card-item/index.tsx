import { ContributorList } from '@/modules/user/components/contributor-list';
import { UpdatedAt } from '@/shared/components/common/updated-at';
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
      className="flex flex-col gap-2 bg-card/90 text-card-foreground rounded-md p-4 shadow-md hover:shadow-lg transition-all border"
    >
      <h3 className="text-xl font-bold truncate break-words whitespace-break-spaces">{topic.title}</h3>
      <p className="text-sm truncate break-words whitespace-break-spaces">{topic.description}</p>

      <section className="flex items-center gap-2">
        <ContributorList contributors={allContributors} />

        <span className="text-sm text-foreground/50">•</span>

        <span className="text-sm">
          {allContributors.length === 1 ? '1 contribuidor' : `${allContributors.length} contribuidores`}
        </span>
      </section>

      <UpdatedAt updatedAt={topic.updatedAt} />
    </Link>
  );
}
