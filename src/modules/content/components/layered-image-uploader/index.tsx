'use client';

import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { LayeredImage } from '../layered-image-node';
import { LayeredImageForm } from './layered-image-form';
import { LayeredImagePreview } from './layered-image-preview';

type LayeredImageUploaderProps = {
  layers: LayeredImage[];
  setLayers: React.Dispatch<React.SetStateAction<LayeredImage[]>>;
  pushLayer: (layer: LayeredImage) => void;
  removeLayer: (id: string) => void;
};

export function LayeredImageUploader({ layers, setLayers, pushLayer, removeLayer }: LayeredImageUploaderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLayers(layers => {
        const oldIndex = layers.findIndex(l => l.id === active.id);
        const newIndex = layers.findIndex(l => l.id === over.id);

        return arrayMove(layers, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ScrollArea className="flex h-[60vh] w-full min-w-fit flex-col rounded-md border p-4">
          <SortableContext items={layers} strategy={verticalListSortingStrategy}>
            {layers.map(layer => (
              <LayeredImagePreview key={layer.id} value={layer} onRemove={removeLayer} className="mb-4" />
            ))}
          </SortableContext>
        </ScrollArea>
      </DndContext>

      <div className="h-full w-full min-w-[25vw]">
        <LayeredImageForm onAdd={pushLayer} defaultValue={{ id: '', src: '', alt: '', title: '' }} />
      </div>
    </>
  );
}
