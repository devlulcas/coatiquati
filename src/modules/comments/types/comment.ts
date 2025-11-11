export type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  parentCommentId: number | null;
  trailId: number | null;
  topicId: number | null;
  publicationId: number | null;
  contentId: number | null;

  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  };
  repliesCount: number;
  votes: {
    up: number;
    down: number;
  };
};
