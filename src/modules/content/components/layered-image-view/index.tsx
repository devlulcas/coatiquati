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
    <div className="flex flex-col gap-2 border p-2 rounded-lg w-fit">
      <ul className="relative w-[350px] h-[350px] overflow-hidden rounded-lg">
        {layers.map((layer: LayeredImage, index: number) => (
          <li
            key={index}
            className="absolute top-0 left-0"
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

      <div className="flex gap-2 w-[350px]">
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
