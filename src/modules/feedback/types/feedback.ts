export type Feedback = {
  id: number;
  type: 'bug' | 'feature' | 'improvement';
  softwareVersion: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  } | null;
};
