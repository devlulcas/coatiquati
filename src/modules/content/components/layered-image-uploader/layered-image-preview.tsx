'use client';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TrashIcon } from 'lucide-react';
import Image from 'next/image';
import type { LayeredImage } from '../layered-image-node';

type LayeredImagePreviewProps = {
  onRemove: (id: string) => void;
  className?: string;
  value: LayeredImage;
};

export function LayeredImagePreview({ onRemove, value, className }: LayeredImagePreviewProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: value.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn('relative flex gap-2 rounded-lg border p-2', className)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Image src={value.src} alt={value.alt} title={value.title} width={150} height={150} className="rounded-lg" />

      <div className="flex flex-col gap-2">
        <span>ID #{value.id}</span>
        <h4>
          Título: <strong>{value.title}</strong>
        </h4>
        <p>
          Alt: <strong>{value.alt}</strong>
        </p>
        <p>
          URL: <strong>{value.src}</strong>
        </p>
      </div>

      <Button
        title="Remover"
        size="icon"
        onClick={() => onRemove(value.id)}
        variant="destructive"
        className="absolute bottom-2 right-2 z-10 opacity-25 transition-opacity hover:opacity-100 focus:opacity-100"
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
