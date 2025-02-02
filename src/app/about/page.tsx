'use client'

import coatiAvif from '@/shared/assets/images/coati.avif';
import coatiSvg from '@/shared/assets/images/coati.svg';
import { ditherImage } from '@/shared/lib/dittering';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Page() {
  const links = {
    github: 'https://github.com/devlulcas/coatiquati',
    me: 'https://github.com/devlulcas/',
  };

  useEffect(() => {
    if (typeof window !== 'undefined') ditherImage('coati')
  }, [])

  return (
    <div className='bg-background/90'>
      <main className="container relative h-[--view-height] grid" style={{ display: 'grid', gridTemplateAreas: "over" }}>
        <div
          style={{ gridArea: 'over' }}
          className="h-[--view-height] w-full p-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coatiAvif.src}
            width={coatiAvif.width}
            height={coatiAvif.height}
            alt="Coati"
            id='coati'
            className="rounded-lg object-cover h-full w-full"
          />
        </div>

        <div className="flex m-4 mt-auto h-fit items-center rounded-lg border bg-background/80 backdrop-blur-2xl p-4 gap-5" style={{ gridArea: 'over' }}>
          <Image src={coatiSvg} alt="Coati" className="opacity-95" width={300} />
          <div className='max-w-prose text-justify text-foreground'>
            <h1 className="text-4xl font-bold">Sobre o projeto</h1>

            <p className="my-8">
              CoatiQuati é um projeto de{' '}
              <a className="text-brand-400 hover:text-brand-300" href={links.github}>
                código aberto
              </a>
              , desenvolvido por{' '}
              <a className="text-brand-400 hover:text-brand-300" href={links.me}>
                mim (Lucas Alves Rego)
              </a>
              , com o objetivo de ajudar pessoas interessadas em aprender algo novo e que não sabem por onde começar.
            </p>

            <p>
              <em className="font-semibold text-brand-400 hover:text-brand-300">Porque o nome CoatiQuati?</em>
              <br />O quati é um animal que vive na América do Sul e Central, e é conhecido por ser um animal curioso e que
              gosta de se aventurar. O nome CoatiQuati é uma brincadeira com o nome do animal em inglês e em português.
            </p>

          </div>
        </div>
      </main>
    </div>

  );
}
