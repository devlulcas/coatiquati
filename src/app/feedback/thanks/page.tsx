import { Button } from '@/shared/components/ui/button';
import { website } from '@/shared/constants/website';
import Image from 'next/image';
import Link from 'next/link';

import racoon from './raccoon.png';

export default function ThanksPage() {
  return (
    <div className="container flex h-[--view-height] flex-wrap items-center">
      <main className="flex flex-col">
        <h1 className="text-4xl font-bold">Obrigado pelo seu feedback !</h1>

        <p className="mt-4 max-w-md border-l-2 border-brand-500 pl-4 text-lg">
          Seu feedback é muito importante para nós. Obrigado por contribuir para melhorar a plataforma. Se quiser, você
          pode também abrir uma issue no nosso repositório no GitHub ou entrar em contato com a gente.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button>
            <Link href={website.code.repositoryUrl} target="_blank" rel="noopener noreferrer">
              Abrir issue no GitHub
            </Link>
          </Button>

          <Button variant="ghost">
            <Link href="/contact">Entrar em contato</Link>
          </Button>
        </div>
      </main>

      <Image src={racoon} alt="guaxinim" className="mx-auto" />
    </div>
  );
}
