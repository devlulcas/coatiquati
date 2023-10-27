import { Providers } from '@/shared/components/common/providers';
import { render } from '@testing-library/react';

export function renderWithProviders(ui: React.ReactElement) {
  return render(<Providers>{ui}</Providers>);
}
