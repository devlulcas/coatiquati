import type { PublicationMediaSelect, PublicationSelect } from '@/modules/database/schema/publication';

export type PublicationMedia = Pick<PublicationMediaSelect, 'description' | 'id' | 'type' | 'url'>;

export type Publication = PublicationSelect & {
  medias: PublicationMedia[];
};
