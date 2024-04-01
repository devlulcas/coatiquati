import coatiAvif from '@/shared/assets/images/coati.avif';
import coatiSvg from '@/shared/assets/images/coati.svg';
import Image from 'next/image';

export default function Page() {
  const links = {
    github: 'https://github.com/devlulcas/coatiquati',
    me: 'https://github.com/devlulcas/',
  };

  return (
    <main className="container flex min-h-[--view-height] flex-col justify-center gap-2 lg:flex-row lg:gap-8">
      <div className="my-4 flex flex-col rounded-lg border bg-background/50 p-4 lg:w-1/2">
        <h1 className="text-4xl font-bold">Sobre o projeto</h1>

        <p className="prose my-8 text-justify text-lg text-white">
          CoatiQuati é um projeto de
          <a className="text-brand-400 hover:text-brand-300" href={links.github}>
            {' '}
            código aberto
          </a>
          , desenvolvido por
          <a className="text-brand-400 hover:text-brand-300" href={links.me}>
            {' '}
            mim (Lucas Alves Rego)
          </a>
          , com o objetivo de ajudar pessoas interessadas em aprender algo novo e que não sabem por onde começar. O
          projeto foi desenvolvido como o meu TCC e está em desenvolvimento.
        </p>

        <p>
          <em className="font-semibold text-brand-400 hover:text-brand-300">Porque o nome CoatiQuati?</em>
          <br />O quati é um animal que vive na América do Sul e Central, e é conhecido por ser um animal curioso e que
          gosta de se aventurar. O nome CoatiQuati é uma brincadeira com o nome do animal em inglês e em português.
        </p>

        <Image src={coatiSvg} alt="Coati" className="mx-auto mt-8 opacity-95" width={300} />
      </div>

      <Image
        src={coatiAvif}
        alt="Coati"
        className="my-4 rounded-lg object-cover grayscale filter transition-all duration-300 hover:grayscale-0 lg:w-1/2"
      />
    </main>
  );
}
