import type {
  InsertCategory,
  SelectCategory,
} from '@/modules/database/schema/category';
import type {
  NewTrailTable,
  TrailTable,
} from '@/modules/database/schema/trail';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Topic } from '@/modules/topic/types/topic';
import type { Contributor } from '@/modules/user/types/user';

type Category = Omit<SelectCategory, 'authorId'>;

type NewCategory = Creatable<InsertCategory>;

type UpdateCategory = Updatable<InsertCategory>;

export type Trail = Omit<TrailTable, 'authorId' | 'category'> & {
  author: Contributor;
  contributors: { user: Contributor }[];
  category: Category | null;
};

export type TrailWithTopicArray = Trail & {
  topics: Topic[];
};

export type UpdateTrail = Omit<Updatable<TrailTable>, 'authorId'> & {
  contributorId: TrailTable['authorId'];
};

export type NewTrail = Creatable<NewTrailTable>;

export type TrailId = TrailTable['id'];
