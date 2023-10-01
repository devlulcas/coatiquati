'use client';

import { SignOutForm } from '@/modules/auth/components/sign-out-form';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePerfStore } from '../../stores/perf-mode-store';

type HeaderNavProps = {
  hasAdminAccess?: boolean;
  isLoggedIn?: boolean;
};

export function HeaderNav({ hasAdminAccess, isLoggedIn }: HeaderNavProps) {
  const togglePerfMode = usePerfStore(state => state.togglePerfMode);
  const perfMode = usePerfStore(state => state.perfMode);

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
              <SignOutForm className="w-full" formClassName="w-full">
                Sair
              </SignOutForm>
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
            <SignOutForm>Sair</SignOutForm>
          </Button>
        ) : (
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Entrar</Link>
          </Button>
        )}

        <Button variant="ghost" onClick={togglePerfMode}>
          {perfMode ? 'Desativar' : 'Ativar'} modo de performance
        </Button>
      </div>
    </>
  );
}
