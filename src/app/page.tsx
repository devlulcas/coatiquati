import { Marquee } from '@/modules/home/components/marquee';
import { TrailCardCarouselSection } from '@/modules/home/components/trail-card-carousel-section';
import { getRecentTrailsQuery } from '@/modules/trail/actions/get-recent-trails-by-id';
import blobImage from '@/shared/assets/images/blob-hq.png';
import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page() {
  const trails = await getRecentTrailsQuery();

  return (
    <div className="flex h-full flex-col justify-between pt-12 lg:h-[--view-height]">
      <div className="container flex flex-col">
        <h1 className="inline-block bg-gradient-to-r from-brand-500 via-purple-600 to-brand-500 bg-clip-text text-5xl font-black text-transparent lg:text-6xl">
          CoatiQuati
        </h1>

        <p className="mt-4 max-w-lg text-pretty pl-1 font-medium leading-7">
          <strong>Coati</strong> é uma plataforma de ensino colaborativo, onde você pode aprender e ensinar qualquer
          coisa. Professores criam trilhas e passam primeiro deixando migalhas de conhecimento, depois estudantes passam
          pelas trilhas aprendendo com o que existe nelas e deixando mais migalhas de conhecimento.
        </p>

        <Link
          href="/trails"
          style={{ backgroundSize: '300% 300%' }}
          className="coati-animated-line mt-8 flex w-fit animate-background rounded-md bg-gradient-to-tr from-brand-500 to-purple-600 p-[2px]"
        >
          <span className="flex h-12 w-fit items-center justify-center rounded-md bg-white px-6 text-black transition duration-300 ease-in-out hover:shadow-lg">
            Conheça as trilhas
            <ArrowUpRightIcon size={20} />
          </span>
        </Link>

        <TrailCardCarouselSection trails={trails} className="mb-4 mt-12" />

        <div className="absolute inset-0 z-[-1] h-[--safe-screen-height] overflow-hidden outline">
          <Image
            className="absolute bottom-0 right-1/2 w-full translate-x-1/2 translate-y-1/2 blur-xl md:w-1/2"
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
