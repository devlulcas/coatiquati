import { getPageSession } from '@/modules/auth/utils/get-page-session';
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

  const session = await getPageSession();
  if (!session) redirect('/sign-in');
  const userId = session.user.id;

  const baseContentRepository = new BaseContentRepository();
  const baseContentData = await baseContentRepository.getBaseContent(contentId);

  const canEdit = isAdminOrAbove(session.user.role) || baseContentData.author.id === userId;

  if (!canEdit) redirect('/');

  return <div className="container py-8">{children}</div>;
}
