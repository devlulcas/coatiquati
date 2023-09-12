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
import { Editor } from '@tiptap/react';
import { LayersIcon } from 'lucide-react';
import {
  LayeredImageUploader,
  useLayeredImageControl,
} from '../layered-image-uploader';
import { EditorActionButton } from './editor-action-button';

export function LayeredImageUploaderDialogTrigger({
  editor,
}: {
  editor: Editor | null;
}) {
  const layeredImageControl = useLayeredImageControl();

  const save = () => {
    if (editor) {
      const cleanLayers = layeredImageControl.layers.filter(
        (layer) => layer.src !== ''
      );

      editor.chain().focus().setLayers({ layers: cleanLayers }).run();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditorActionButton icon={<LayersIcon />} label="layers" />
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
