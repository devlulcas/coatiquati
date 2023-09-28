'use client';

import { useState } from 'react';
import type { LayeredImage } from '../editor/layered-image-node';

export function useLayeredImageControl(defaultLayers: LayeredImage[] = []) {
  const [layers, setLayers] = useState<LayeredImage[]>(defaultLayers);

  const pushLayer = (layer: LayeredImage) => {
    setLayers([...layers, layer]);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  return { layers, pushLayer, setLayers, removeLayer };
}
