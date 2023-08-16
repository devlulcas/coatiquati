'use client';

import { roles } from '@/modules/auth/constants/roles';
import { SortedColumnHeader } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import { ColumnDef } from '@tanstack/react-table';
import { RatIcon, SquirrelIcon } from 'lucide-react';
import Link from 'next/link';
import { User } from '../../types/user';
import { EditUserRole } from '../edit-user-role';

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <SortedColumnHeader column={column}>ID</SortedColumnHeader>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <SortedColumnHeader column={column}>Permissão</SortedColumnHeader>
    ),
    cell: ({ row }) => {
      const isAdmin = row.original.role === roles.ADMIN;

      return (
        <span
          className={cn(
            'flex gap-1 items-center justify-center',
            isAdmin ? 'text-purple-500' : 'text-pink-400'
          )}
        >
          {isAdmin ? <SquirrelIcon size={18} /> : <RatIcon size={18} />}
          {isAdmin ? 'Administrador' : 'Usuário'}
        </span>
      );
    },
  },
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
    accessorKey: 'email',
    header: 'E-mail',
  },
  {
    id: 'edit',
    cell: ({ row }) => <EditUserRole user={row.original} />,
  },
];
