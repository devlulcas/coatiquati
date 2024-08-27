import { SignOutForm } from '@/modules/auth/components/sign-out-form';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { User } from '@/modules/user/types/user';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

type HeaderNavProps = {
  user: Pick<User, 'role' | 'username'> | null;
};

export function HeaderNav({ user }: HeaderNavProps) {
  const hasAdminAccess = user && isAdminOrAbove(user.role);
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
          className="flex flex-col items-center justify-center gap-4 bg-background/75 backdrop-blur-md lg:hidden"
        >
          <Button className="w-full" variant="secondary" asChild>
            <Link href="/trails">Trilhas</Link>
          </Button>

          <Button className="w-full" variant="secondary" asChild>
            <Link href="/about">Sobre</Link>
          </Button>

          {hasAdminAccess && (
            <Button className="w-full" variant="secondary" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {user !== null ? (
            <>
              <Button className="w-full" variant="destructive" asChild>
                <SignOutForm className="w-full" formClassName="w-full">
                  Sair
                </SignOutForm>
              </Button>
              <Button className="w-full" variant="secondary" asChild>
                <Link href={createProfileUrl(user.username)}>Perfil</Link>
              </Button>
            </>
          ) : (
            <Button className="w-full" variant="secondary" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
          )}
        </SheetContent>
      </Sheet>

      <div className="hidden flex-row items-center gap-2 lg:flex">
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

        {user !== null ? (
          <>
            <Button variant="ghost" asChild>
              <SignOutForm>Sair</SignOutForm>
            </Button>
            <Button variant="ghost" asChild>
              <Link href={createProfileUrl(user.username)}>Perfil</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/feedback">Feedback</Link>
            </Button>
          </>
        ) : (
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Entrar</Link>
          </Button>
        )}
      </div>
    </>
  );
}
