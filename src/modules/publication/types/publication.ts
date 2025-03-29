import type { PublicationSelect } from '@/modules/database/schema/publication';
import type { PublicationMediaSelect } from '@/modules/database/schema/publication-media';

export type PublicationMedia = Pick<PublicationMediaSelect, 'description' | 'id' | 'type' | 'url'>;

export type Publication = PublicationSelect & {
  medias: PublicationMedia[];
};
