import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { redirect } from 'next/navigation';

type EditContentLayoutProps = {
  children: React.ReactNode;
  params: {
    contentId: string;
  };
};

export default async function EditContentLayout({ children, params }: EditContentLayoutProps) {
  const contentId = Number(params.contentId);

  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');

  const baseContentRepository = new BaseContentRepository();
  const baseContentData = await baseContentRepository.getBaseContent(contentId);

  const canEdit = isAdminOrAbove(user.role) || baseContentData.author.id === user.id;
  if (!canEdit) redirect('/');

  return <div className="container py-8">{children}</div>;
}
