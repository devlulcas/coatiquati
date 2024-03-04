import type { JSONContent } from '@tiptap/core';

export type Feedback = {
  id: number;
  type: string;
  softwareVersion: string;
  text: JSONContent;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  } | null;
};
