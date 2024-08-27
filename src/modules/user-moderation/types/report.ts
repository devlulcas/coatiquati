import type { ReportSelect } from '@/modules/database/schema/report';

export type Report = ReportSelect & {
  reportedBy: {
    id: string;
    username: string;
    avatar: string;
    email: string;
    bannedAt: Date | null;
  };
  reportedEntity: {
    id: number;
    type: 'trail' | 'topic' | 'content' | 'publication';
  };
  user: {
    id: string;
    username: string;
    avatar: string;
    email: string;
    bannedAt: Date | null;
  };
};
