'use client';
import type { ImageContent } from '@/modules/content/types/content';
import { UserAvatar } from '@/shared/components/common/user-avatar';
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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { ZoomInIcon } from 'lucide-react';
import Link from 'next/link';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type ZoomedImageProps = {
  content: ImageContent;
};

export function ZoomedImage({ content }: ZoomedImageProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon" variant="outline">
          <ZoomInIcon size={16} />
          <span className="sr-only">Ver mais detalhes da imagem</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95dvh] lg:max-w-[45vw]">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          {content.description && (
            <DialogDescription className="text-md text-muted-foreground">
              {content.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <ResizablePanelGroup
          className="min-h-[75dvh]"
          direction={isDesktop ? 'horizontal' : 'vertical'}
        >
          <ResizablePanel className="max-h-[75dvh]">
            <Zoom>
              {/** biome-ignore lint/performance/noImgElement: <This is an raw image to be zoomed> */}
              <img
                alt={content.imageContent.alt}
                src={content.imageContent.src}
                width={1240}
                height={1080}
              />
            </Zoom>
          </ResizablePanel>
          <ResizableHandle withHandle className="mx-2" />
          <ResizablePanel>
            <aside className="flex w-full flex-col gap-2 rounded border bg-secondary p-4 text-secondary-foreground">
              <h4 className="text-md font-bold">{content.title}</h4>

              {content.description && (
                <ScrollArea className="h-1/2 py-2">
                  <span className="text-muted-foreground">Descrição: </span>
                  {content.description}
                </ScrollArea>
              )}

              <p className="whitespace-break-spaces">
                <span className="text-muted-foreground">Autor: </span>
                <span className="truncate">{content.author.name}</span>
              </p>

              <p className="whitespace-break-spaces">
                <span className="text-muted-foreground">Criado em: </span>
                {new Date(content.createdAt).toLocaleDateString()}
              </p>

              <p className="whitespace-break-spaces">
                <span className="text-muted-foreground">Modificado em: </span>
                {new Date(content.updatedAt).toLocaleDateString()}
              </p>

              <ul>
                {content.contributors.map((contributor) => (
                  <li
                    key={contributor.id}
                    className="flex items-center gap-2 overflow-x-clip rounded border border-primary/20 p-1"
                  >
                    <UserAvatar user={contributor} className="rounded" />
                    <Link
                      className="truncate"
                      href={`/profile/${contributor.username}`}
                    >
                      {contributor.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </ResizablePanel>
        </ResizablePanelGroup>

        <DialogFooter>
          {content.author && (
            <span className="text-md text-muted-foreground">
              Por {content.author.name}
            </span>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
