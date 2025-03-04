import { SignOutForm } from '@/modules/auth/components/sign-out-form';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { ConfigDropdown, ConfigListing } from '@/modules/theme/components/config-dropdown';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { User } from '@/modules/user/types/user';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

type HeaderNavProps = {
  user: Pick<User, 'role' | 'username'> | null;
};

export async function HeaderNav({ user }: HeaderNavProps) {
  return (
    <>
      <Button variant="link" asChild className="lg:hidden">
        <Link href="/trails">Trilhas</Link>
      </Button>

      <Sheet>
        <SheetTrigger className="lg:hidden">
          <MenuIcon />
          <span className="sr-only">Abrir menu</span>
        </SheetTrigger>

        <SheetContent
          hideCloseButton
          side="bottom"
          className="flex flex-col gap-4 bg-background/75 backdrop-blur-md lg:hidden"
        >
          <div className="flex flex-col items-center justify-center gap-4 *:bg-secondary">
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/trails">Trilhas</Link>
            </Button>

            <Button className="w-full" variant="ghost" asChild>
              <Link href="/about">Sobre</Link>
            </Button>

            <NavItems user={user} />
          </div>

          <ConfigListing />
        </SheetContent>
      </Sheet>

      <div className="hidden flex-row items-center gap-2 lg:flex">
        <Button variant="ghost" asChild>
          <Link href="/trails">Trilhas</Link>
        </Button>

        <Button variant="ghost" asChild>
          <Link href="/about">Sobre</Link>
        </Button>

        <NavItems user={user} />

        <ConfigDropdown />
      </div>
    </>
  );
}

function NavItems({ user }: { user: Pick<User, 'role' | 'username'> | null }) {
  const hasAdminAccess = user && isAdminOrAbove(user.role);

  if (user !== null) {
    return (
      <>
        {hasAdminAccess && (
          <Button className="w-full" variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}

        <Button className="w-full" variant="ghost" asChild>
          <Link href={createProfileUrl(user.username)}>Perfil</Link>
        </Button>

        <Button className="w-full bg-destructive md:bg-transparent md:text-red-500" variant="ghost" asChild>
          <SignOutForm className="w-full" formClassName="w-full">
            Sair
          </SignOutForm>
        </Button>
      </>
    );
  }

  return (
    <Button className="w-full" variant="secondary" asChild>
      <Link href="/sign-in">Entrar</Link>
    </Button>
  );
}
