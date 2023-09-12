'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/utils/cn';
import { ArrowUpIcon, PlusIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useId, useState } from 'react';
import type { LayeredImage } from '../editor/layered-image-node';

export function useLayeredImageControl(defaultLayers: LayeredImage[] = []) {
  const [layers, setLayers] = useState<LayeredImage[]>(defaultLayers);

  const pushLayer = (layer: LayeredImage) => {
    setLayers([...layers, layer]);
  };

  const removeLayer = (index: number) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const updateLayerOrder = (from: number, to: number) => {
    const layer = layers[from];
    const newLayers = layers.filter((_, i) => i !== from);
    newLayers.splice(to, 0, layer);
    setLayers(newLayers);
  };

  const layerUp = (index: number) => {
    if (index > 0) {
      updateLayerOrder(index, index - 1);
    }
  };

  const layerDown = (index: number) => {
    if (index < layers.length - 1) {
      updateLayerOrder(index, index + 1);
    }
  };

  return { layers, pushLayer, removeLayer, layerUp, layerDown };
}

type LayeredImageUploaderProps = {
  layers: LayeredImage[];
  pushLayer: (layer: LayeredImage) => void;
  removeLayer: (index: number) => void;
  layerUp: (index: number) => void;
  layerDown: (index: number) => void;
};

export function LayeredImageUploader(props: LayeredImageUploaderProps) {
  const { layers, layerDown, layerUp, pushLayer, removeLayer } = props;

  return (
    <>
      <ScrollArea className="h-[60vh] w-full min-w-fit flex flex-col rounded-md border p-4">
        {layers.map((layer, index) => (
          <LayerPreview
            key={layer.src}
            index={index}
            value={layer}
            onRemove={removeLayer}
            onUp={layerUp}
            onDown={layerDown}
            className="mb-4"
          />
        ))}
      </ScrollArea>

      <div className="w-full h-full min-w-[25vw]">
        <LayerInput
          onAdd={pushLayer}
          defaultValue={{ src: '', alt: '', title: '' }}
        />
      </div>
    </>
  );
}

function LayerInput(props: {
  onAdd: (layer: LayeredImage) => void;
  defaultValue?: LayeredImage;
  className?: string;
}) {
  const { onAdd, defaultValue, className } = props;

  const id = useId();

  const [src, setSrc] = useState(defaultValue?.src || '');
  const [alt, setAlt] = useState(defaultValue?.alt || '');
  const [title, setTitle] = useState(defaultValue?.title || '');

  return (
    <div
      className={cn(
        'flex h-full flex-col gap-4 p-4 border rounded-lg',
        className
      )}
    >
      <div className="flex gap-3 flex-col border-b w-full">
        <Label htmlFor={'layer-src' + id}>Camada</Label>
        <Input
          id={'layer-src' + id}
          placeholder="URL"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
        />
      </div>

      <div className="flex gap-3 flex-col border-b w-full">
        <Label htmlFor={`layer-alt-${id}`}>Texto alternativo</Label>
        <Input
          id={`layer-alt-${id}`}
          placeholder="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
      </div>

      <div className="flex gap-3 flex-col border-b w-full">
        <Label htmlFor={`layer-title-${id}`}>Título</Label>
        <Input
          id={`layer-title-${id}`}
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <Button
        className="w-full mt-auto"
        title="Adicionar"
        onClick={() => onAdd({ src, alt, title })}
        variant="default"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

function LayerPreview(props: {
  index: number;
  onRemove: (index: number) => void;
  onUp: (index: number) => void;
  onDown: (index: number) => void;
  className?: string;
  value: LayeredImage;
}) {
  const { index, onRemove, onUp, onDown, value, className } = props;

  return (
    <div className={cn('flex gap-4 p-4 border rounded-lg', className)}>
      <div className="flex gap-4 w-full">
        <Image
          src={value.src}
          alt={value.alt}
          title={value.title}
          width={150}
          height={150}
          className="rounded-lg"
        />

        <div className="flex flex-col gap-2">
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
      </div>

      <div className="flex flex-col gap-1 justify-between border-l pl-4">
        <Button
          title="Mover para cima"
          onClick={() => onUp(index)}
          variant="secondary"
        >
          <ArrowUpIcon />
        </Button>

        <Button
          title="Remover"
          onClick={() => onRemove(index)}
          variant="destructive"
        >
          <TrashIcon />
        </Button>

        <Button
          title="Mover para baixo"
          onClick={() => onDown(index)}
          variant="secondary"
        >
          <ArrowUpIcon className="rotate-180" />
        </Button>
      </div>
    </div>
  );
}
