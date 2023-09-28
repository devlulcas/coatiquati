import coatiAvif from '@/shared/assets/images/coati.avif';
import coatiSvg from '@/shared/assets/images/coati.svg';
import Image from 'next/image';

export default function Page() {
  const links = {
    github: 'https://github.com/devlulcas/coatiquati',
    me: 'https://github.com/devlulcas/',
  };

  return (
    <main className="flex justify-center gap-4 lg:gap-8 min-h-[--view-height] flex-col lg:flex-row container">
      <div className="lg:w-1/2 p-4 border bg-background/50 my-4 rounded-lg flex flex-col">
        <h1 className="text-4xl font-bold">Sobre o projeto</h1>

        <p className="prose my-8 text-justify text-lg">
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
          , com o objetivo de ajudar pessoas interessadas em aprender algo novo e que não sabem por
          onde começar. O projeto foi desenvolvido como o meu TCC e está em desenvolvimento.
        </p>

        <p>
          <em className="text-brand-400 hover:text-brand-300 font-semibold">
            Porque o nome CoatiQuati?
          </em>
          <br />O quati é um animal que vive na América do Sul e Central, e é conhecido por ser um
          animal curioso e que gosta de se aventurar. O nome CoatiQuati é uma brincadeira com o nome
          do animal em inglês e em português.
        </p>

        <Image src={coatiSvg} alt="Coati" className="mx-auto my-auto opacity-95" width={300} />
      </div>

      <Image
        src={coatiAvif}
        alt="Coati"
        className="lg:w-1/2 object-cover my-4 rounded-lg filter grayscale hover:grayscale-0 transition-all duration-300"
      />
    </main>
  );
}
