'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/utils/cn';
import { nanoid } from '@/shared/utils/nanoid';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { LayeredImage } from '../editor/layered-image-node';

export function useLayeredImageControl(defaultLayers: LayeredImage[] = []) {
  const [layers, setLayers] = useState<LayeredImage[]>(defaultLayers);

  const pushLayer = (layer: LayeredImage) => {
    setLayers([...layers, layer]);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter((l) => l.id !== id));
  };

  return { layers, pushLayer, setLayers, removeLayer };
}

type LayeredImageUploaderProps = {
  layers: LayeredImage[];
  setLayers: React.Dispatch<React.SetStateAction<LayeredImage[]>>;
  pushLayer: (layer: LayeredImage) => void;
  removeLayer: (id: string) => void;
};

export function LayeredImageUploader({
  layers,
  setLayers,
  pushLayer,
  removeLayer,
}: LayeredImageUploaderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLayers((layers) => {
        const oldIndex = layers.findIndex((l) => l.id === active.id);
        const newIndex = layers.findIndex((l) => l.id === over.id);

        return arrayMove(layers, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="h-[60vh] w-full min-w-fit flex flex-col rounded-md border p-4">
          <SortableContext
            items={layers}
            strategy={verticalListSortingStrategy}
          >
            {layers.map((layer) => (
              <LayerPreview
                key={layer.id}
                value={layer}
                onRemove={removeLayer}
                className="mb-4"
              />
            ))}
          </SortableContext>
        </ScrollArea>
      </DndContext>

      <div className="w-full h-full min-w-[25vw]">
        <LayerInput
          onAdd={pushLayer}
          defaultValue={{ id: '', src: '', alt: '', title: '' }}
        />
      </div>
    </>
  );
}

const layeredImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  title: z.string(),
});

function LayerInput(props: {
  onAdd: (layer: LayeredImage) => void;
  defaultValue?: LayeredImage;
  className?: string;
}) {
  const { onAdd, defaultValue, className } = props;

  const form = useForm<LayeredImage>({
    resolver: zodResolver(layeredImageSchema),
    defaultValues: defaultValue,
  });

  const onSubmit = async (values: LayeredImage) => {
    onAdd({
      ...values,
      id: nanoid(),
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'flex h-full flex-col gap-4 p-4 border rounded-lg',
          className
        )}
        action="/api/sign-in"
      >
        <FormField
          control={form.control}
          name="src"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da imagem</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://placekitten.com/500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto alternativo</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Imagem de um gato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Gato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="secondary" className="w-full mt-auto" type="submit">
          Adicionar camada
        </Button>
      </form>
    </Form>
  );
}

function LayerPreview(props: {
  onRemove: (id: string) => void;
  className?: string;
  value: LayeredImage;
}) {
  const { onRemove, value, className } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: value.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn('flex gap-2 p-2 border rounded-lg relative', className)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Image
        src={value.src}
        alt={value.alt}
        title={value.title}
        width={150}
        height={150}
        className="rounded-lg"
      />

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
        className="absolute bottom-2 right-2 z-10 opacity-25 hover:opacity-100 focus:opacity-100 transition-opacity"
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
