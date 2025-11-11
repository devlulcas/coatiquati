import type { SelectTopic } from '@/modules/database/schema/topic';
import type { Contributor } from '@/modules/user/types/user';

export type Topic = Omit<SelectTopic, 'authorId'> & {
  contributors: Contributor[];
  author: Contributor;
};
