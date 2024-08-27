import { render } from '@react-email/render';

export const emailToHtml = (email: JSX.Element): Promise<string> => {
  return render(email);
};
