'use client';

import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { getEmbedIDFromYoutubeUrl } from '@/modules/video-content/lib/youtube';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import 'react-medium-image-zoom/dist/styles.css';
import type { PublicationMedia } from '../types/publication';

export function PublicationMediaGrid({ medias }: { medias: PublicationMedia[] }) {
  const length = medias.length;

  return (
    <div
      className={cn(
        'mt-4 grid gap-2',
        length === 1 ? 'grid-cols-1' : 'grid-cols-2',
        length <= 2 ? 'grid-rows-1' : 'grid-rows-2',
      )}
    >
      {medias.map((media, index) => (
        <div
          key={media.id}
          className={cn(
            'aspect-w-16 aspect-h-9 relative min-h-40 w-full overflow-hidden rounded bg-secondary',
            length === 3 && index === 2 ? 'col-span-2 row-span-1' : '',
          )}
        >
          {media.type === 'image' ? <PublicationImageEmbed {...media} /> : <PublicationVideoEmbed {...media} />}

          <DescriptionAlertDialog description={media.description} />
        </div>
      ))}
    </div>
  );
}

export function PublicationImageEmbed({ description, url }: Pick<PublicationMedia, 'description' | 'url'>) {
  return (
    <Link
      href={url}
      target="_blank"
      className="aspect-w-16 aspect-h-9 relative flex w-full items-center justify-center overflow-clip"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={description} />
    </Link>
  );
}

export function PublicationVideoEmbed({ description, url }: Pick<PublicationMedia, 'description' | 'url'>) {
  const videoId = getEmbedIDFromYoutubeUrl(url);

  if (!videoId) {
    return 'Vídeo inválido';
  }

  return (
    <div className="my-auto">
      <YouTubeEmbed id={videoId} title={description} />
    </div>
  );
}

function DescriptionAlertDialog({ description }: { description: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="absolute bottom-2 left-2 rounded bg-background/50 px-2 py-1 text-xs text-foreground">
          ver descrição
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Descrição feita pelo autor</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
