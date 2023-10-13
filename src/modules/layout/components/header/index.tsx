import { getPageSession } from '@/modules/auth/utils/get-page-session';
import coatiSvg from '@/shared/assets/images/coati.svg';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderNav } from './header-nav';

export async function Header() {
  const session = await getPageSession();

  return (
    <header className="z-50 top-0 sticky border-b h-[--header-height] bg-background/75 backdrop-blur-md">
      <div className="flex items-center justify-between container h-full">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src={coatiSvg} alt="CoatiQuati" height={34} />
          <h1 className="text-xs lg:text-xl font-bold">CoatiQuati</h1>
        </Link>

        <HeaderNav user={session?.user} />
      </div>
    </header>
  );
}
