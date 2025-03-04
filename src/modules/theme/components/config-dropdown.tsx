import { getFontQuery } from '@/modules/theme/actions/change-font-mutation';
import { getThemeQuery } from '@/modules/theme/actions/change-theme-mutation';
import { ChangeColorThemeForm } from '@/modules/theme/components/change-color-theme-form';
import { ChangeFontThemeForm } from '@/modules/theme/components/change-font-theme-form';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/shared/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { SettingsIcon } from 'lucide-react';
import { getBackgroundQuery } from '../actions/change-background-mutation';
import { ChangeBackgroundThemeForm } from './change-background-theme-form';

export async function ConfigDropdown() {
  const theme = await getThemeQuery();
  const font = await getFontQuery();
  const background = await getBackgroundQuery();

  return (
    <DropdownMenu>
      <Button variant="ghost" asChild>
        <DropdownMenuTrigger>
          <span>Configurações</span> <SettingsIcon />
        </DropdownMenuTrigger>
      </Button>

      <DropdownMenuContent>
        <DropdownMenuItem className="flex items-center justify-between gap-5">
          <s>Tema de cor</s>
          <ChangeColorThemeForm initialTheme={theme.value} />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between gap-5">
          Fonte de texto
          <ChangeFontThemeForm initialFont={font.value} />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between gap-5">
          Fundo
          <ChangeBackgroundThemeForm initialBackground={background.value} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export async function ConfigListing() {
  const theme = await getThemeQuery();
  const font = await getFontQuery();
  const background = await getBackgroundQuery();

  return (
    <>
      <Button asChild className="flex w-full items-center justify-between" variant="outline">
        <div>
          <s>Tema de cor</s>
          <ChangeColorThemeForm initialTheme={theme.value} />
        </div>
      </Button>

      <Button asChild className="flex w-full items-center justify-between" variant="outline">
        <div>
          Fonte de texto
          <ChangeFontThemeForm initialFont={font.value} />
        </div>
      </Button>

      <Button asChild className="flex w-full items-center justify-between" variant="outline">
        <div>
          Fundo
          <ChangeBackgroundThemeForm initialBackground={background.value} />
        </div>
      </Button>
    </>
  );
}
