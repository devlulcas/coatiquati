import { emailTemplates } from '@/modules/email/lib/templates';
import { render } from '@react-email/render';

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const template = url.pathname.split('/').pop();

  const selectedTemplate = emailTemplates[template as keyof typeof emailTemplates];

  if (!selectedTemplate) {
    return new Response('Template not found', { status: 404 });
  }

  const el = await render(selectedTemplate, { pretty: true });

  return new Response(el, {
    headers: { 'Content-Type': 'text/html' },
  });
};
