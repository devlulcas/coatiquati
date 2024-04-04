'use client';
import { TrailCard } from '@/modules/trail/components/trail-card';
import type { Trail } from '@/modules/trail/types/trail';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/shared/components/ui/carousel';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type TrailCardCarouselSectionProps = { trails: Trail[] } & React.HTMLAttributes<HTMLDivElement>;

export function TrailCardCarouselSection({ trails, ...rest }: TrailCardCarouselSectionProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
  }, [api]);

  if (trails.length === 0) return null;

  return (
    <section {...rest}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trilhas recentes</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => api?.scrollPrev()}
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-card text-card-foreground"
          >
            <ArrowLeftIcon size={16} />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-card text-card-foreground"
          >
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {trails.map(trail => (
            <CarouselItem key={trail.id} className="basis-[75%] lg:basis-1/5">
              <TrailCard trail={trail} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
