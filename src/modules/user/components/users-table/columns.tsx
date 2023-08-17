'use client';

import { SortedColumnHeader } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { type User } from '../../types/user';
import { EditUserRole } from '../edit-user-role';
import { UserRoleBadge } from '../user-role-badge';
import { UserAvatar } from './user-avatar';

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'Usuário',
    cell: ({ row }) => {
      return (
        <Button variant="link" asChild>
          <Link href={`/profile/${row.original.username}`}>
            {row.original.username}
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <SortedColumnHeader column={column}>Permissão</SortedColumnHeader>
    ),
    cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <UserAvatar
        avatar={row.original.avatar}
        username={row.original.username}
      />
    ),
  },
  {
    id: 'edit',
    cell: ({ row }) => <EditUserRole user={row.original} />,
  },
];
