import { SignOutAction } from '@/modules/auth/components/sign-out-action';
import { roles } from '@/modules/auth/constants/roles';
import { getPageSession } from '@/modules/auth/helpers/get-page-session';
import logoImage from '@/shared/assets/images/favicon.svg';
import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export async function Header() {
  const session = await getPageSession();

  const hasAdminAccess = session !== null && session.user.role === roles.ADMIN;

  return (
    <header className="top-0 sticky border-b h-[--header-height] bg-background/75 backdrop-blur-md">
      <div className="flex items-center justify-between container h-full">
        <Link href="/" className="flex item-center gap-2">
          <Image src={logoImage} alt="CoatiQuati" />
          <h1 className="text-xl font-bold">CoatiQuati</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/trails">Trilhas</Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/about">Sobre</Link>
          </Button>

          {hasAdminAccess && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {session !== null ? (
            <Button variant="ghost" asChild>
              <SignOutAction>Sair</SignOutAction>
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
