import { getCurrentUser } from '@/modules/auth/services/next';
import { ConfigDropdown } from '@/modules/theme/components/config-dropdown';
import coatiSvg from '@/shared/assets/images/coati.svg';
import { Button } from '@/shared/components/ui/button';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderNav } from './header-nav';

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 h-[--header-height] border-b bg-background/50 backdrop-blur-lg">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-background/50 via-transparent to-foreground/5" />

      <div className="container flex h-full items-center justify-between *:flex-1">
        <Link href="/" className="flex items-center justify-start gap-2">
          <Image aria-labelledby="coati-logo" src={coatiSvg} alt="CoatiQuati" height={34} />
          <p id="coati-logo" className="sr-only md:not-sr-only text-xs font-bold lg:text-xl">
            CoatiQuati
          </p>
        </Link>

        <HeaderNav user={user} />

        <div className="flex items-center justify-end">
          <ConfigDropdown
            trigger={
              <Button variant="ghost" size="icon">
                <GearSixIcon size={20} weight="duotone" />
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
}
