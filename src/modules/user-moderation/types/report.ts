import type { ReportSelect } from '@/modules/database/schema/report';

export type Report = ReportSelect & {
  reportedBy: {
    id: string;
    username: string;
    avatar: string;
    email: string;
    isBanned: boolean;
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
    isBanned: boolean;
  };
};
