import { TextEditor } from '@/modules/content/components/editor';

type PageProps = {
  params: {
    topic: string;
  };
};

export default async function Page({ params }: PageProps) {
  return (
    <div className="py-8 container">
      <TextEditor initialContent="<p>Before</p><image-uploader-node></image-uploader-node<strong>After</strong>" />
    </div>
  );
}
