import { Button } from '@/shared/components/ui/button';
import { mergeAttributes, Node, type NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { GripIcon, PencilIcon } from 'lucide-react';
import { LayeredImageUploaderDialogTrigger } from '../layered-image-uploader/layered-image-uploader-dialog-trigger';
import { LayeredImageView } from '../layered-image-view';

export type LayeredImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
};

type LayeredImageNodeAttributes = {
  layers: LayeredImage[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    layeredImage: {
      setLayers: (options: LayeredImageNodeAttributes) => ReturnType;
    };
  }
}

type LayeredImageVisualizationProps = NodeViewProps;

function LayeredImageVisualization(props: LayeredImageVisualizationProps) {
  return (
    <NodeViewWrapper className="layeredImageNode">
      <div className="relative w-fit h-fit">
        <Button
          size="icon"
          className="absolute top-4 left-4 z-10 opacity-25 hover:opacity-100 focus:opacity-100 transition-opacity"
          variant="ghost"
          data-drag-handle
        >
          <GripIcon />
          <span className="sr-only">Mover</span>
        </Button>

        <LayeredImageUploaderDialogTrigger
          defaultData={props.node.attrs.layers}
          onSave={layers => {
            props.updateAttributes({
              layers,
            });
          }}
        >
          <Button
            size="icon"
            className="absolute top-4 right-4 z-10 opacity-25 hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <PencilIcon />
            <span className="sr-only">Editar camadas</span>
          </Button>
        </LayeredImageUploaderDialogTrigger>

        <LayeredImageView layers={props.node.attrs.layers} />
      </div>
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: 'layeredImageNode',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      layers: [],
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div [data-type="layeredImageNode"]',
      },
    ];
  },
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return ['layeredImageNode', mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(LayeredImageVisualization);
  },
  addCommands() {
    return {
      setLayers:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
