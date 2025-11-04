'use client';

import { getRole } from '@/modules/auth/lib/auth-client';
import type { SelectUser } from '@/modules/database/schema/auth';
import { SortedColumnHeader } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { EditUserRole } from '../edit-user-role';
import { UserRoleBadge } from '../user-role-badge';
import { UserAvatar } from './user-avatar';

type ColumnUser = Pick<
  SelectUser,
  | 'id'
  | 'name'
  | 'username'
  | 'role'
  | 'image'
  | 'email'
  | 'emailVerified'
  | 'banned'
  | 'createdAt'
  | 'updatedAt'
>;

export const usersColumns: ColumnDef<ColumnUser>[] = [
  {
    header: 'Login',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <UserAvatar
            avatar={row.original.image}
            username={row.original.username}
          />
          <span className="text-sm font-medium">{row.original.name}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.banned ? 'Banido' : 'Não banido'}
          </span>
        </div>
      );
    },
  },
  {
    header: 'Login',
    accessorKey: 'username',
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
    cell: ({ row }) => <UserRoleBadge role={getRole(row.original.role)} />,
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
    cell: ({ row }) => (
      <>
        {row.original.email} (
        {row.original.emailVerified ? 'Verificado' : 'Não verificado'})
      </>
    ),
  },
  {
    id: 'edit',
    cell: ({ row }) => (
      <EditUserRole
        user={{
          id: row.original.id,
          username: row.original.username,
          image: row.original.image,
          role: getRole(row.original.role),
          banned: Boolean(row.original.banned),
          name: row.original.name,
          createdAt: row.original.createdAt,
        }}
      />
    ),
  },
];
