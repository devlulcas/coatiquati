'use client';

import { authClient } from '@/modules/auth/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createTrailUrl } from '../../lib/create-trail-url';

export function VisualizeTrailAsAdmin({ trailId }: { trailId: number }) {
  const canViewAllTrails = useQuery({
    queryKey: ['canViewAllTrails'],
    queryFn: async () => {
      const result = await authClient.admin.hasPermission({
        permission: {
          trail: ['view_all'],
        },
      });

      return result.data?.success;
    },
  });

  const pathname = usePathname();

  if (pathname === createTrailUrl(trailId, true)) {
    return null;
  }

  if (!canViewAllTrails.data) {
    return null;
  }

  return (
    <Link
      href={createTrailUrl(trailId, true)}
      className="flex items-center gap-2 text-sm text-brand-300"
    >
      Visualizar trilha como administrador
    </Link>
  );
}
