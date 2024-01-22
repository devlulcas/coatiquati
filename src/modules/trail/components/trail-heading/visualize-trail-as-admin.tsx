'use client';

import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createTrailUrl } from '../../lib/create-trail-url';

export function VisualizeTrailAsAdmin({ trailId }: { trailId: number }) {
  const currentUserDataQuery = useCurrentUserDataQuery();

  const pathname = usePathname();

  if (pathname === createTrailUrl(trailId, true)) {
    return null;
  }

  if (!currentUserDataQuery.data || !isAdminOrAbove(currentUserDataQuery.data.role)) {
    return null;
  }

  return (
    <Link href={createTrailUrl(trailId, true)} className="flex items-center gap-2 text-sm text-brand-300">
      Visualizar trilha como administrador
    </Link>
  );
}
