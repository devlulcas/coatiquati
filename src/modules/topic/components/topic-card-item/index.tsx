import { UpdatedAt } from '@/shared/components/common/updated-at';
import Link from 'next/link';
import type { Topic } from '../../types/topic';

type TopicCardItemProps = {
  topic: Topic;
};

export function TopicCardItem({ topic }: TopicCardItemProps) {
  return (
    <Link
      href={`/trails/${topic.trailId}/topics/${topic.id}`}
      className="flex flex-col gap-2 bg-card/90 text-card-foreground rounded-md p-4 shadow-md hover:shadow-lg transition-all border"
    >
      <h3 className="text-xl font-bold truncate break-words whitespace-break-spaces">
        {topic.title}
      </h3>

      <p className="text-sm truncate break-words whitespace-break-spaces">
        {topic.description}
      </p>

      <UpdatedAt updatedAt={topic.updatedAt} />
    </Link>
  );
}
