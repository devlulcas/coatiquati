import { DataTable } from '@/shared/components/common/data-table';
import { User } from '../../types/user';
import { usersColumns } from './columns';

type UserTableProps = {
  data: User[];
};

export function UsersTable({ data }: UserTableProps) {
  return <DataTable columns={usersColumns} data={data} />;
}
