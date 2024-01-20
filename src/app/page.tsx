import { Marquee } from '@/modules/home/components/marquee';
import { TrailCard } from '@/modules/trail/components/trail-card';
import { GetRecentTrailsUseCase } from '@/modules/trail/use-cases/get-recent-trails-use-case';
import blobImage from '@/shared/assets/images/blob-hq.png';
import { FootprintsIcon } from 'lucide-react';
import Image from 'next/image';

const recentTrailsUseCase = new GetRecentTrailsUseCase();

export default async function Page() {
  const trails = await recentTrailsUseCase.execute();

  return (
    <div className="pt-12 h-[--view-height] flex flex-col">
      <div className="flex flex-col container">
        <h1 className="text-5xl lg:text-6xl font-black">CoatiQuati! Aprenda mais ensinando.</h1>

        <p style={{ ['textWrap' as string]: 'balance' }} className="font-medium mt-4 max-w-3xl">
          <strong>Coati</strong> é uma plataforma de ensino colaborativo, onde você pode aprender e ensinar qualquer
          coisa. Professores criam trilhas e passam primeiro deixando migalhas de conhecimento, depois estudantes passam
          pelas trilhas aprendendo com o que existe nelas e deixando mais migalhas de conhecimento.
        </p>

        <a
          className="flex gap-2 items-center w-fit mt-8 px-4 py-2 bg-white text-purple-800 rounded-sm font-bold hover:text-fuchsia-600 transition-colors"
          href="/trails"
        >
          Conheça as trilhas
          <FootprintsIcon />
        </a>

        <div>
          <h2 className="text-2xl font-bold mt-8">Trilhas recentes</h2>
          <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {trails.map(trail => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </main>
        </div>

        <div className="overflow-hidden outline absolute h-[--safe-screen-height] inset-0 z-[-1]">
          <Image
            className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-full md:w-1/2 blur-xl"
            src={blobImage}
            alt="blob"
          />
        </div>
      </div>

      <Marquee
        className="mt-auto"
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
