'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/utils/cn';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTransition } from 'react';
import { setThemeMutation } from '../actions/change-theme-mutation';

export function ChangeColorThemeForm({ initialTheme }: { initialTheme: 'dark' | 'light' }) {
  const [isPending, startTransition] = useTransition();
  const isDark = initialTheme === 'dark';
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <SwitchPrimitives.Root
              disabled
              id="theme"
              name="theme"
              defaultChecked={isDark}
              onCheckedChange={checked => {
                const theme = checked ? 'dark' : 'light';
                startTransition(async () => {
                  await setThemeMutation(theme);
                });
              }}
              className={cn(
                'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <SwitchPrimitives.Thumb
                className={cn(
                  'pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-background p-1 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                )}
              >
                <span className={cn('p-1', isPending && 'animate-spin')}>
                  {isDark ? <MoonIcon fill="currentColor" size={14} /> : <SunIcon fill="currentColor" size={14} />}
                </span>
              </SwitchPrimitives.Thumb>
            </SwitchPrimitives.Root>

            <label htmlFor="theme" className="sr-only">
              {isPending ? 'Mudando' : 'Mudar'} para {isDark ? 'claro' : 'escuro'}
            </label>
          </div>
        </TooltipTrigger>
        <TooltipContent variant="warning">
          <p>Alterar para o tema claro ainda não está disponível</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
