'use client';

import type { ContentWithImage } from '@/modules/content/types/content';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { ZoomInIcon } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type ZoomedImageProps = {
  content: ContentWithImage;
};

export function ZoomedImage({ content }: ZoomedImageProps) {
  const { content: data, ...meta } = content;

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon" variant="outline">
          <ZoomInIcon size={16} />
          <span className="sr-only">Ver mais detalhes da imagem</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="lg:max-w-[45vw] max-h-[95dvh]">
        <DialogHeader>
          <DialogTitle>{meta.title}</DialogTitle>
          <DialogDescription className="text-md text-muted-foreground">{data.description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 divide-x">
          <Zoom>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={data.alt} src={data.src} width={1240} height={1080} />
          </Zoom>

          <aside className="bg-secondary text-secondary-foreground p-4 rounded border flex flex-col gap-2 w-fit">
            <h4 className="text-md font-bold">{meta.title}</h4>

            <ScrollArea className="h-1/2 w-[12vw] text-sm border-y border-white/10 p-2">{data.description}</ScrollArea>

            <p className="whitespace-break-spaces">
              <span className="text-md text-muted-foreground">Autor: </span>
              <span className="text-sm block truncate">{meta.author.username}</span>
            </p>
          </aside>
        </div>
        <DialogFooter>
          {meta.author && <span className="text-md text-muted-foreground">Por {meta.author.username}</span>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
