import coatiSvg from '@/shared/assets/images/coati.svg';
import { FileWarningIcon } from 'lucide-react';
import Image from 'next/image';

export default function WipPage() {
  return (
    <main className="fixed inset-0 z-[999] grid h-full w-full place-items-center bg-background">
      <div>
        <div className="flex items-center gap-4">
          <Image src={coatiSvg} alt="Coati" className="mx-auto my-8 opacity-95" width={150} />

          <h1 className="inline-block bg-gradient-to-r from-brand-500 via-brand-400 to-brand-700 bg-clip-text text-3xl font-black text-transparent md:text-5xl lg:text-6xl">
            Olá! Estamos em manutenção.
          </h1>
        </div>

        <div className="flex flex-wrap items-center">
          <p className="flex w-full items-center rounded bg-foreground/10 p-4 lg:max-w-80">
            <FileWarningIcon className="mr-2 h-8 w-8 flex-shrink-0 text-brand-400" />
            Você foi redirecionado para a página de manutenção.
          </p>
          <p className="mt-2 md:ml-4 lg:mt-0">
            Estamos trabalhando para melhorar a sua experiência.
            <br />
            Por favor, volte mais tarde.
            <br />
            <span className="italic">Obrigado pela compreensão.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
