import { MainHeading } from '@/modules/home/components/main-heading';
import { Marquee } from '@/modules/home/components/marquee';
import { LucideExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-[--view-height] flex flex-col bg-background/90">
      <main className="h-full container border-x flex-1">
        <div className="flex flex-col items-center my-20">
          <MainHeading />

          <p className="mt-10 max-w-xl text-balance text-center px-1 font-medium leading-6">
            <em className="font-semibold not-italic">explore e compartilhe sabedoria</em> sem fronteiras
          </p>

          <div className="mt-4 grid md:grid-flow-col items-center md:auto-cols-max gap-1 md:gap-3 leading-none">
            <Link
              href="/sign-in"
              className="h-14 md:h-10 col-span-2 md:col-span-1 flex items-center justify-center px-10 md:px-8 border bg-gradient-to-br from-purple-200/90 via-purple-300/25 to-green-600/80 rounded-lg relative before:rounded-md before:w-[95%] before:h-[90%] before:bg-green-400/20 before:border before:border-green-50/10 before:absolute"
            >
              Entre
            </Link>
            <span> ou </span>
            <Link href="/trails" className="text-green-500">
              explore livremente <LucideExternalLink className="inline-flex size-[1.25ch]" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t">
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
      </footer>
    </div>
  );
}

// import { Marquee } from '@/modules/home/components/marquee';
// import { TrailCardCarouselSection } from '@/modules/home/components/trail-card-carousel-section';
// import { getRecentTrailsQuery } from '@/modules/trail/actions/get-recent-trails-by-id';
// import blobImage from '@/shared/assets/images/blob-hq.png';
// import { AppFeedbackCard } from '@/shared/components/common/app-feedback-card';
// import { isFail } from '@/shared/lib/result';
// import { ArrowUpRightIcon } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Suspense } from 'react';

// export default async function Page() {
//   return (
//     <div className="flex h-[--view-height] flex-col justify-between pt-12">
//       <div className="container flex h-full flex-col">
//         <h1 className="inline-block bg-gradient-to-r from-brand-500 via-violet-500 to-brand-100 bg-clip-text text-5xl font-black text-transparent lg:text-6xl">
//           CoatiQuati
//         </h1>

//         <p className="mt-3 max-w-md text-pretty pl-1 font-medium leading-6">
//           Descubra a Coati, a{' '}
//           <em className="font-semibold not-italic">plataforma interativa</em>{' '}
//           onde o conhecimento flui livremente, permitindo que você{' '}
//           <em className="font-semibold not-italic">
//             explore e compartilhe sabedoria
//           </em>{' '}
//           sem fronteiras.
//         </p>

//         <Link
//           href="/trails"
//           style={{ backgroundSize: '300% 300%' }}
//           className="coati-animated-line mt-4 flex w-fit animate-background rounded-md bg-gradient-to-tr from-brand-500 to-purple-600 p-[2px]"
//         >
//           <span className="flex h-12 w-fit items-center justify-center rounded-md bg-white px-6 text-black transition duration-300 ease-in-out hover:shadow-lg">
//             Conheça as trilhas
//             <ArrowUpRightIcon size={20} />
//           </span>
//         </Link>

//         <Suspense fallback={<RecentTrailsSectionFallback />}>
//           <RecentTrailsSection />
//         </Suspense>

//         <div className="absolute inset-0 z-[-1] h-[--view-height] overflow-hidden">
//           <Image
//             className="absolute bottom-0 right-1/2 w-full translate-x-1/2 translate-y-1/2 opacity-70 blur-xl md:w-1/2"
//             src={blobImage}
//             alt="blob"
//           />
//         </div>
//       </div>

//       <Marquee
//         words={[
//           'matemática',
//           'física',
//           'química',
//           'biologia',
//           'história',
//           'geografia',
//           'português',
//           'inglês',
//           'espanhol',
//           'filosofia',
//           'sociologia',
//           'artes',
//           'educação física',
//           'programação',
//           'design',
//           'música',
//           'dança',
//           'teatro',
//           'literatura',
//           'economia',
//           'política',
//           'direito',
//           'medicina',
//           'aprenda algo novo',
//           'compartilhe conhecimento',
//         ]}
//       />
//     </div>
//   );
// }

// async function RecentTrailsSection() {
//   const trailsResult = await getRecentTrailsQuery();

//   if (isFail(trailsResult)) {
//     return (
//       <AppFeedbackCard
//         variant="warning"
//         className="mb-auto mt-auto flex h-[50vh]"
//       >
//         Não foi possível carregar as trilhas recentes.
//       </AppFeedbackCard>
//     );
//   }

//   if (trailsResult.value.length === 0) {
//     return (
//       <AppFeedbackCard
//         variant="warning"
//         className="mb-auto mt-auto flex h-[50vh]"
//       >
//         Ainda não há nenhuma trilha
//       </AppFeedbackCard>
//     );
//   }

//   return (
//     <TrailCardCarouselSection
//       trails={trailsResult.value}
//       className="mb-auto mt-auto"
//     />
//   );
// }

// function RecentTrailsSectionFallback() {
//   return (
//     <AppFeedbackCard variant="info" className="mb-auto mt-auto flex h-[50vh]">
//       Carregando...
//     </AppFeedbackCard>
//   );
// }
