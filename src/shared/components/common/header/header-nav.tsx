'use client';

import { SignOutAction } from '@/modules/auth/components/sign-out-action';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

export function HeaderNav({
  hasAdminAccess,
  isLoggedIn,
}: {
  hasAdminAccess?: boolean;
  isLoggedIn?: boolean;
}) {
  return (
    <>
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <MenuIcon />
          <span className="sr-only">Abrir menu</span>
        </SheetTrigger>

        <SheetContent
          hideCloseButton
          side="bottom"
          className="lg:hidden flex flex-col items-center justify-center gap-4 bg-background/75 backdrop-blur-md"
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

          {isLoggedIn ? (
            <Button className="w-full" variant="destructive" asChild>
              <SignOutAction className="w-full" formClassName="w-full">
                Sair
              </SignOutAction>
            </Button>
          ) : (
            <Button className="w-full" variant="secondary" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
          )}
        </SheetContent>
      </Sheet>

      <div className="hidden lg:flex flex-row items-center gap-2">
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

        {isLoggedIn ? (
          <Button variant="ghost" asChild>
            <SignOutAction>Sair</SignOutAction>
          </Button>
        ) : (
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Entrar</Link>
          </Button>
        )}
      </div>
    </>
  );
}
