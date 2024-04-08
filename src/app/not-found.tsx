import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-[--view-height]">
      <Image
        src="/raccoon-cute.gif"
        alt="404"
        width={500}
        height={500}
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-95"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-2xl">Página não encontrada</p>
        <Link href="/">Voltar para a página inicial</Link>
      </div>
    </div>
  );
}
