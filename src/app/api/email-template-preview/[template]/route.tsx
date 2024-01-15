import { ConfirmCodeEmail } from '@/modules/email/components/confirm-code-email';
import { ResetPasswordEmail } from '@/modules/email/components/reset-password-email';
import { VerifyAccountEmail } from '@/modules/email/components/verify-account-email';
import { render } from '@react-email/components';

export const templates = {
  'confirm-code': <ConfirmCodeEmail name="John Doe" code="123abc" />,
  'reset-password': <ResetPasswordEmail name="John Doe" url="https://example.com/reset-password?token=123abc" />,
  'verify-account': <VerifyAccountEmail name="John Doe" url="https://example.com/verify-account?token=123abc" />,
};

export const GET = (request: Request) => {
  const url = new URL(request.url);
  const template = url.pathname.split('/').pop();

  const selectedTemplate = templates[template as keyof typeof templates];

  if (!selectedTemplate) {
    return new Response('Template not found', { status: 404 });
  }

  return new Response(render(selectedTemplate), {
    headers: { 'Content-Type': 'text/html' },
  });
};
