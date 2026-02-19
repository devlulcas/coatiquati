import { getFontQuery } from '@/modules/theme/actions/change-font-mutation';
import { getThemeQuery } from '@/modules/theme/actions/change-theme-mutation';
import { ChangeColorThemeForm } from '@/modules/theme/components/change-color-theme-form';
import { ChangeFontThemeForm } from '@/modules/theme/components/change-font-theme-form';
import { QuickDialog } from '@/shared/components/common/quick-dialog';
import { getBackgroundQuery } from '../actions/change-background-mutation';
import { ChangeBackgroundThemeForm } from './change-background-theme-form';

export async function ConfigDropdown({ trigger }: { trigger: React.ReactNode }) {
  const theme = await getThemeQuery();
  const font = await getFontQuery();
  const background = await getBackgroundQuery();

  return (
    <QuickDialog trigger={trigger} title="Configurações">
      <ul className="flex flex-col gap-2">
        <li className="flex items-center justify-between gap-5">
          <span>Tema de cor</span>
          <ChangeColorThemeForm initialTheme={theme.value} />
        </li>
        <li className="flex items-center justify-between gap-5">
          <span>Fonte de texto</span>
          <ChangeFontThemeForm initialFont={font.value} />
        </li>
        <li className="flex items-center justify-between gap-5">
          <span>Fundo</span>
          <ChangeBackgroundThemeForm initialBackground={background.value} />
        </li>
      </ul>
    </QuickDialog>
  );
}
