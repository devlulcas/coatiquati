import { render } from '@react-email/render';

import type { JSX } from 'react';

export const emailToHtml = (email: JSX.Element): Promise<string> => {
  return render(email);
};
