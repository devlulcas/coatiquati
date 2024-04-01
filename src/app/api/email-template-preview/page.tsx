import { templates } from './[template]/route';

export default function EmailTemplatePreview() {
  const templateKeys = Object.keys(templates);

  return (
    <div className="container my-8 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">EmailTemplatePreview</h1>

      {templateKeys.map(templateKey => (
        <div key={templateKey} className="rounded border bg-muted p-4">
          <h2 className="text-center text-xl font-bold text-foreground">{templateKey}</h2>

          <iframe src={`/api/email-template-preview/${templateKey}`} className="h-96 w-full" />
        </div>
      ))}
    </div>
  );
}
