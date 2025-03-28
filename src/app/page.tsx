import { Marquee } from '@/modules/home/components/marquee';
import { TrailCardCarouselSection } from '@/modules/home/components/trail-card-carousel-section';
import { getRecentTrailsQuery } from '@/modules/trail/actions/get-recent-trails-by-id';
import blobImage from '@/shared/assets/images/blob-hq.png';
import { AppFeedbackCard } from '@/shared/components/common/app-feedback-card';
import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page() {
  const trailsResult = await getRecentTrailsQuery();

  return (
    <div className="flex h-[--view-height] flex-col justify-between pt-12">
      <div className="container flex h-full flex-col">
        <h1 className="inline-block bg-gradient-to-r from-brand-500 via-violet-500 to-brand-100 bg-clip-text text-5xl font-black text-transparent lg:text-6xl">
          CoatiQuati
        </h1>

        <p className="mt-3 max-w-md text-pretty pl-1 font-medium leading-6">
          Descubra a Coati, a <em className="font-semibold not-italic">plataforma interativa</em> onde o conhecimento
          flui livremente, permitindo que você{' '}
          <em className="font-semibold not-italic">explore e compartilhe sabedoria</em> sem fronteiras.
        </p>

        <Link
          href="/trails"
          style={{ backgroundSize: '300% 300%' }}
          className="coati-animated-line mt-4 flex w-fit animate-background rounded-md bg-gradient-to-tr from-brand-500 to-purple-600 p-[2px]"
        >
          <span className="flex h-12 w-fit items-center justify-center rounded-md bg-white px-6 text-black transition duration-300 ease-in-out hover:shadow-lg">
            Conheça as trilhas
            <ArrowUpRightIcon size={20} />
          </span>
        </Link>

        {trailsResult.type === 'ok' ? (
          trailsResult.value.length > 0 ? (
            <TrailCardCarouselSection trails={trailsResult.value} className="mb-auto mt-auto" />
          ) : (
            <AppFeedbackCard variant="warning" className="mb-auto mt-auto flex h-[50vh]">
              Ainda não há nenhuma trilha
            </AppFeedbackCard>
          )
        ) : (
          <AppFeedbackCard variant="warning" className="mb-auto mt-auto flex h-[50vh]">
            Não foi possível carregar as trilhas recentes.
          </AppFeedbackCard>
        )}

        <div className="absolute inset-0 z-[-1] h-[--view-height] overflow-hidden">
          <Image
            className="absolute bottom-0 right-1/2 w-full translate-x-1/2 translate-y-1/2 opacity-70 blur-xl md:w-1/2"
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
          'aprenda algo novo',
          'compartilhe conhecimento',
        ]}
      />
    </div>
  );
}
