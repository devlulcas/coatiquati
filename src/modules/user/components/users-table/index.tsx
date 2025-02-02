'use client'

import { DataTable } from '@/shared/components/common/data-table';
import { useUsersQuery } from '../../hooks/use-users-query';
import { usersColumns } from './columns';

export function UsersTable() {
  const q = useUsersQuery()
  return <DataTable columns={usersColumns} data={q.data ?? []} />;
}
