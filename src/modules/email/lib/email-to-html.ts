import { render } from '@react-email/render';

export const emailToHtml = (email: JSX.Element): string => {
  return render(email);
};
