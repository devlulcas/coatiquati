import type {
  CategoryTable,
  NewCategoryTable,
  NewTrailTable,
  TrailTable,
} from '@/modules/database/schema/trail';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Topic } from '@/modules/topic/types/topic';
import type { Contributor } from '@/modules/user/types/user';

export type Category = Omit<CategoryTable, 'authorId'>;

export type NewCategory = Creatable<NewCategoryTable>;

export type UpdateCategory = Updatable<NewCategoryTable>;

export type Trail = Omit<TrailTable, 'authorId'> & {
  author: Contributor;
  contributors: Contributor[];
  category: Category;
};

export type TrailWithTopicArray = Trail & {
  topics: Topic[];
};

export type UpdateTrail = Updatable<TrailTable>;

export type NewTrail = Creatable<NewTrailTable>;
