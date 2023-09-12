import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { LayeredImageView } from '../layered-image-view';

export type LayeredImage = {
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

type LayeredImageVisualizationProps = {
  node: {
    attrs: LayeredImageNodeAttributes;
  };
};

function LayeredImageVisualization(props: LayeredImageVisualizationProps) {
  return (
    <NodeViewWrapper className="layeredImageNode">
      <LayeredImageView layers={props.node.attrs.layers} />
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
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
