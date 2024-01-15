import { templates } from './[template]/route';

export default function EmailTemplatePreview() {
  const templateKeys = Object.keys(templates);

  return (
    <div className="container my-8 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">EmailTemplatePreview</h1>

      {templateKeys.map(templateKey => (
        <div key={templateKey} className="border rounded p-4 bg-muted">
          <h2 className="text-xl font-bold text-center text-foreground">{templateKey}</h2>

          <iframe src={`/api/email-template-preview/${templateKey}`} className="w-full h-96" />
        </div>
      ))}
    </div>
  );
}
