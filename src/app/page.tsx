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
