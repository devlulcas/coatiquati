import { DataTable } from '@/shared/components/common/data-table';
import { type Trail } from '../../types/trail';
import { trailsColumns } from './columns';

type TrailTableProps = {
  data: Trail[];
};

export function TrailsTable({ data }: TrailTableProps) {
  return <DataTable columns={trailsColumns} data={data} />;
}
