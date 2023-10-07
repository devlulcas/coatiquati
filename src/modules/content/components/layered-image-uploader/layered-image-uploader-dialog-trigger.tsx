'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { LayersIcon } from 'lucide-react';
import { LayeredImageUploader } from '.';
import { EditorActionButton } from '../editor/editor-action-button';
import type { LayeredImage } from '../layered-image-node';
import { useLayeredImageControl } from './use-layered-image-control';

type LayeredImageUploaderDialogTriggerProps = {
  onSave: (data: LayeredImage[]) => void;
  defaultData?: LayeredImage[];
  children?: React.ReactNode;
};

export function LayeredImageUploaderDialogTrigger({
  onSave,
  defaultData = [],
  children,
}: LayeredImageUploaderDialogTriggerProps) {
  const layeredImageControl = useLayeredImageControl(defaultData);

  const { toast } = useToast();

  const save = () => {
    const cleanLayers = layeredImageControl.layers.filter(layer => layer.src !== '');

    onSave(cleanLayers);

    toast({
      title: 'Camadas salvas',
      description: 'As camadas foram salvas com sucesso.',
      variant: 'success',
      duration: 1000,
    });

    layeredImageControl.setLayers([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {typeof children !== 'undefined' ? children : <EditorActionButton icon={<LayersIcon />} label="layers" />}
      </DialogTrigger>

      <DialogContent className="min-w-fit max-w-[80vw]">
        <DialogTitle>Camadas</DialogTitle>
        <DialogDescription className="flex gap-4 flex-col lg:flex-row">
          <LayeredImageUploader {...layeredImageControl} />
        </DialogDescription>
        <DialogFooter>
          <Button onClick={save}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
