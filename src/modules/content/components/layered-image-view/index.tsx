import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';
import type { LayeredImage } from '../layered-image-node';

type LayeredImageViewProps = {
  layers: LayeredImage[];
};

export function LayeredImageView({ layers }: LayeredImageViewProps) {
  const [visibleLayerIndexes, setVisibleLayerIndexes] = useState<number[]>(
    layers.map((_: unknown, index: number) => index),
  );

  const handleLayerClick = (index: number) => {
    if (visibleLayerIndexes.includes(index)) {
      setVisibleLayerIndexes(visibleLayerIndexes.filter(i => i !== index));
    } else {
      setVisibleLayerIndexes([...visibleLayerIndexes, index]);
    }
  };

  return (
    <div className="flex w-fit flex-col gap-2 rounded-lg border p-2">
      <ul className="relative h-[350px] w-[350px] overflow-hidden rounded-lg">
        {layers.map((layer: LayeredImage, index: number) => (
          <li
            key={index}
            className="absolute left-0 top-0"
            style={{
              opacity: (() => {
                if (index === 0) return 1;
                return visibleLayerIndexes.includes(index) ? 0.75 : 0;
              })(),
            }}
          >
            <Image src={layer.src} alt={layer.alt} width={350} height={350} />
          </li>
        ))}
      </ul>

      <div className="flex w-[350px] gap-2">
        {layers.map((_: LayeredImage, index: number) => {
          if (index === 0) return null;

          return (
            <Button
              key={index}
              variant={visibleLayerIndexes.includes(index) ? 'default' : 'secondary'}
              onClick={() => handleLayerClick(index)}
              className="w-full"
            >
              {index}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
