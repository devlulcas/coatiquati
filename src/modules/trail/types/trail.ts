import type { db } from '@/modules/database/db';
import type { SelectCategory } from '@/modules/database/schema/category';
import type { ContentStatus } from '@/modules/database/schema/content';
import type { SelectTrail } from '@/modules/database/schema/trail';
import {
  CONTRIBUTOR_COLUMNS,
  type Contributor,
} from '@/modules/user/types/user';

type Category = {
  id: number;
  name: string;
};

export const CATEGORY_COLUMNS = {
  id: true,
  name: true,
} satisfies Partial<Record<keyof SelectCategory, true>>;

export type Trail = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;

  author: Contributor;
  contributors: Contributor[];
  category: Category | null;
};

export const TRAIL_COLUMNS = {
  id: true,
  title: true,
  description: true,
  thumbnail: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Partial<Record<keyof SelectTrail, true>>;

export const TRAIL_QUERY = {
  columns: TRAIL_COLUMNS,
  with: {
    author: {
      columns: CONTRIBUTOR_COLUMNS,
    },
    contributions: {
      columns: {},
      where: (fields, operators) => {
        return operators.isNotNull(fields.deletedAt);
      },
      with: {
        user: {
          columns: CONTRIBUTOR_COLUMNS,
        },
      },
    },
    category: {
      columns: CATEGORY_COLUMNS,
    },
  },
} satisfies Parameters<typeof db.query.trails.findFirst>[0];

export function mapToTrail(
  trail: Pick<Trail, keyof typeof TRAIL_COLUMNS> & {
    author: Contributor;
    contributions: {
      user: Contributor;
    }[];
    category: Category | null;
  }
): Trail {
  return {
    id: trail.id,
    title: trail.title,
    description: trail.description,
    thumbnail: trail.thumbnail,
    status: trail.status,
    createdAt: trail.createdAt,
    updatedAt: trail.updatedAt,

    author: trail.author,
    contributors: trail.contributions.map((contribution) => contribution.user),
    category: trail.category,
  };
}
