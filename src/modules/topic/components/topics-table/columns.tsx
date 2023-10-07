'use client';

import { ContentStatusBadge } from '@/shared/components/common/content-status-badge';
import { SortedColumnHeader } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { createTopicUrl } from '../../lib/create-topic-url';
import { type Topic } from '../../types/topic';
import { EditTopicDialogTrigger } from '../edit-topic-dialog-trigger';

export const topicsColumns: ColumnDef<Topic>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => <SortedColumnHeader column={column}>Status</SortedColumnHeader>,
    cell: ({ row }) => <ContentStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => (
      <Button variant="link" asChild>
        <Link href={createTopicUrl(row.original.id, row.original.trailId)}>{row.original.title}</Link>
      </Button>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortedColumnHeader column={column}>Atualizado em</SortedColumnHeader>,
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
  },
  {
    accessorKey: 'thumbnail',
    header: 'Thumbnail',
    cell: ({ row }) => {
      return (
        <Image
          className="rounded-md mx-auto"
          src={row.original.thumbnail ?? '/images/placeholder.png'}
          alt={row.original.title}
          height={50}
          width={50}
        />
      );
    },
  },
  {
    id: 'edit',
    cell: ({ row }) => <EditTopicDialogTrigger topic={row.original} />,
  },
];
