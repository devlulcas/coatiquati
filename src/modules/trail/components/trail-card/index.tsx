import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Trail } from '../../types/trail';

type TrailCardProps = {
  trail: Trail;
};

export function TrailCard({ trail }: TrailCardProps) {
  return (
    <Link
      href={`/trails/${trail.id}`}
      className="flex flex-col justify-center items-center w-96 bg-card text-card-foreground rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out border"
    >
      <div className="relative">
        <Image
          alt={trail.title}
          src={trail.thumbnail}
          width={300}
          height={300}
          className="object-cover object-center w-full "
        />

        <div className="absolute bottom-2 left-2 flex gap-2">
          <Avatar>
            <AvatarFallback>
              {trail.authorId[0] + trail.authorId[1]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="p-4 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase min-h-[2lh] line-clamp-2 break-words">
            {trail.title}
          </h2>
          <p className="mt-2 text-sm text-card-foreground/75 w-full min-h-[4lh] line-clamp-4 break-words">
            {trail.description}
          </p>

          <time
            className="block mt-2 text-sm text-card-foreground-500"
            dateTime={trail.updatedAt}
          >
            Atualizado em {new Date(trail.updatedAt).toLocaleString()}
          </time>
        </div>

        <div className="w-full flex gap-2 mt-4">
          <Button className="w-full">
            Ver mais
            <ArrowRightIcon size={18} />
          </Button>
        </div>
      </div>
    </Link>
  );
}
