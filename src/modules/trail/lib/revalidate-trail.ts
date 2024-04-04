import { revalidatePath } from 'next/cache';

export const revalidateTrails = async (options: { username: string; trailId?: number }) => {
  revalidatePath('/trails');
  revalidatePath('/dashboard');
  revalidatePath('/profile/' + options.username);

  if (options.trailId) {
    revalidatePath('/trails/' + options.trailId);
  }
};
