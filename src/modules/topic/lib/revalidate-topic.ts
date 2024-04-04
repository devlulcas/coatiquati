import { revalidatePath } from 'next/cache';

export const revalidateTopics = async (options: { username: string; trailId: number; topicId?: number }) => {
  revalidatePath('/profile/' + options.username);
  revalidatePath('/trails/' + options.trailId);
  revalidatePath('/topics/' + options.topicId);
  revalidatePath('/dashboard/trails/' + options.trailId);

  if (options.topicId) {
    revalidatePath('/trails/' + options.trailId + '/topics/' + options.topicId);
  }
};
