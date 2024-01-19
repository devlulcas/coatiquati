'use client';

import { SortedColumnHeader } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { createTrailUrl } from '../../lib/create-trail-url';
import { type Trail } from '../../types/trail';
import { EditTrailDialogTrigger } from '../edit-trail-dialog-trigger';
import { ToggleTrailStatusForm } from '../toggle-trail-status-form';

export const trailsColumns: ColumnDef<Trail>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => <SortedColumnHeader column={column}>Status</SortedColumnHeader>,
    cell: ({ row }) => <ToggleTrailStatusForm trail={row.original} />,
  },
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => (
      <Button variant="link" asChild>
        <Link href={createTrailUrl(row.original.id, true)}>{row.original.title}</Link>
      </Button>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => <p>{row.original.description}</p>,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortedColumnHeader column={column}>Atualizado em</SortedColumnHeader>,
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <SortedColumnHeader column={column}>Categoria</SortedColumnHeader>,
    cell: ({ row }) => row.original.category?.name || '-',
  },
  {
    accessorKey: 'thumbnail',
    header: 'Thumbnail',
    cell: ({ row }) => {
      return (
        <Image
          className="rounded-md mx-auto"
          src={row.original.thumbnail}
          alt={row.original.title}
          height={50}
          width={50}
        />
      );
    },
  },
  {
    id: 'edit',
    cell: ({ row }) => <EditTrailDialogTrigger trail={row.original} />,
  },
];
