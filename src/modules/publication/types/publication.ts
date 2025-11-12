import type { SelectPublication } from '@/modules/database/schema/publication';
import type { SelectPublicationMedia } from '@/modules/database/schema/publication-media';

export type PublicationMedia = Pick<
  SelectPublicationMedia,
  'description' | 'id' | 'type' | 'url'
>;

export type Publication = SelectPublication & {
  medias: PublicationMedia[];
};
