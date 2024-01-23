import { Marquee } from '@/modules/home/components/marquee';
import { GetRecentTrailsUseCase } from '@/modules/trail/use-cases/get-recent-trails-use-case';
import blobImage from '@/shared/assets/images/blob-hq.png';

import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TrailCardCarouselSection } from './trail-card-carousel-section';

const recentTrailsUseCase = new GetRecentTrailsUseCase();

export default async function Page() {
  const trails = await recentTrailsUseCase.execute();

  return (
    <div className="pt-12 h-full lg:h-[--view-height] flex flex-col justify-between">
      <div className="flex flex-col container">
        <h1 className="text-5xl lg:text-6xl bg-gradient-to-r from-brand-500 via-purple-600 to-brand-500 inline-block text-transparent bg-clip-text font-black">
          CoatiQuati
        </h1>

        <p className="font-medium mt-4 max-w-lg pl-1 text-pretty leading-7">
          <strong>Coati</strong> é uma plataforma de ensino colaborativo, onde você pode aprender e ensinar qualquer
          coisa. Professores criam trilhas e passam primeiro deixando migalhas de conhecimento, depois estudantes passam
          pelas trilhas aprendendo com o que existe nelas e deixando mais migalhas de conhecimento.
        </p>

        <Link
          href="/trails"
          className="group relative inline-flex gap-2 h-12 items-center justify-center overflow-hidden rounded-md border mt-8 w-fit bg-primary px-6 font-medium text-primary-foreground transition-all duration-300 hover:translate-x-3 hover:-translate-y-3 hover:[box-shadow:-5px_5px_#a3a3a3,-10px_10px_#d4d4d4]"
        >
          Conheça as trilhas
          <ArrowUpRightIcon size={20} />
        </Link>

        <TrailCardCarouselSection trails={trails} className="mt-12 mb-4" />

        <div className="overflow-hidden outline absolute h-[--safe-screen-height] inset-0 z-[-1]">
          <Image
            className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-full md:w-1/2 blur-xl"
            src={blobImage}
            alt="blob"
          />
        </div>
      </div>

      <Marquee
        words={[
          'matemática',
          'física',
          'química',
          'biologia',
          'história',
          'geografia',
          'português',
          'inglês',
          'espanhol',
          'filosofia',
          'sociologia',
          'artes',
          'educação física',
          'programação',
          'design',
          'música',
          'dança',
          'teatro',
          'literatura',
          'economia',
          'política',
          'direito',
          'medicina',
          'enfermagem',
          'psicologia',
        ]}
      />
    </div>
  );
}
