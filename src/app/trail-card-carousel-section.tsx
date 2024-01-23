'use client';
import { TrailCard } from '@/modules/trail/components/trail-card';
import type { Trail } from '@/modules/trail/types/trail';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/shared/components/ui/carousel';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type TrailCardCarouselSectionProps = { trails: Trail[] } & React.HTMLAttributes<HTMLDivElement>;

export function TrailCardCarouselSection({ trails, ...rest }: TrailCardCarouselSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section {...rest}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Trilhas recentes</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => api?.scrollPrev()}
            className="h-8 w-8 flex items-center justify-center border bg-card text-card-foreground rounded-full"
          >
            <ArrowLeftIcon size={16} />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="h-8 w-8 flex items-center justify-center border bg-card text-card-foreground rounded-full"
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
