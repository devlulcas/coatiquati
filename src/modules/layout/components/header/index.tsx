import { validateRequest } from '@/modules/auth/services/next';
import coatiSvg from '@/shared/assets/images/coati.svg';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderNav } from './header-nav';

export async function Header() {
  const { data: user } = await validateRequest();

  return (
    <header className="sticky top-0 z-50 h-[--header-height] border-b bg-background/50 backdrop-blur-lg">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-background/50 via-transparent to-foreground/5" />

      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src={coatiSvg} alt="CoatiQuati" height={34} />
          <h1 className="text-xs font-bold lg:text-xl">CoatiQuati</h1>
        </Link>

        <div className="flex items-center space-x-2">
          <HeaderNav user={user} />
        </div>
      </div>
    </header>
  );
}
