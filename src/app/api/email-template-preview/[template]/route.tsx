import { emailTemplates } from '@/modules/email/lib/templates';
import { render } from '@react-email/components';

export const GET = (request: Request) => {
  const url = new URL(request.url);
  const template = url.pathname.split('/').pop();

  const selectedTemplate = emailTemplates[template as keyof typeof emailTemplates];

  if (!selectedTemplate) {
    return new Response('Template not found', { status: 404 });
  }

  return new Response(render(selectedTemplate), {
    headers: { 'Content-Type': 'text/html' },
  });
};
