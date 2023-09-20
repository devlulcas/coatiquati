import type { Content } from '@/modules/content/types/content';
import type {
  NewTopicTable,
  TopicTable,
} from '@/modules/database/schema/topic';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Contributor } from '@/modules/user/types/user';

export type Topic = Omit<TopicTable, 'authorId'> & {
  contributors: { user: Contributor }[];
  author: Contributor;
};

export type NewTopic = Creatable<NewTopicTable>;

export type UpdateTopic = Updatable<TopicTable>;

export type TopicWithContentArray = Topic & {
  contents: Content[];
};
