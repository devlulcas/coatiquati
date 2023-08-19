'use client';

import { SortedColumnHeader } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import Link from 'next/link';
import { type Topic } from '../../types/topic';
import { EditTopicDialogTrigger } from '../edit-topic-dialog-trigger';
import { StatusBadge } from './status-badge';

export const topicsColumns: ColumnDef<Topic>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <SortedColumnHeader column={column}>Status</SortedColumnHeader>
    ),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => (
      <Button variant="link" asChild>
        <Link
          href={`/trails/${row.original.trailId}/topics/${row.original.id}`}
        >
          {row.original.title}
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <SortedColumnHeader column={column}>Atualizado em</SortedColumnHeader>
    ),
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
  },
  {
    id: 'edit',
    cell: ({ row }) => <EditTopicDialogTrigger topic={row.original} />,
  },
  {
    id: 'order',
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center flex-col">
          <Button variant="ghost">
            <ArrowUpIcon />
          </Button>
          <span className="text-sm">{row.index + 1}</span>
          <Button variant="ghost">
            <ArrowDownIcon />
          </Button>
        </div>
      );
    },
  },
];
