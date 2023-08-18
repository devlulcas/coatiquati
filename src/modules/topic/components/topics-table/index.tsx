import { DataTable } from '@/shared/components/common/data-table';
import { type Topic } from '../../types/topic';
import { topicsColumns } from './columns';

type TopicTableProps = {
  data: Topic[];
};

export function TopicsTable({ data }: TopicTableProps) {
  return <DataTable columns={topicsColumns} data={data} />;
}
