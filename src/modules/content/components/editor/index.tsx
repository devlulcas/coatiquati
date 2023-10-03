'use client';

import { Button } from '@/shared/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useRichTextEditor } from '../../hooks/use-rich-text-editor';
import { NewImageContentDialogTrigger } from '../new-image-content-dialog-trigger';
import { NewVideoContentDialogTrigger } from '../new-video-content-dialog-trigger';
import { EditorContent } from './editor-content';
import css from './editor.module.css';
import { MenuBar } from './menu-bar';

type TextEditorProps = {
  initialContent?: string;
};

const onSave = async (content?: string) => {
  await fetch('/api/markdown/save', {
    method: 'POST',
    body: JSON.stringify({
      content,
    }),
  });
};

export function TextEditor({ initialContent }: TextEditorProps) {
  const editor = useRichTextEditor({ initialContent });

  const saveMutation = useMutation({
    mutationFn: onSave,
  });

  const saveManually = () => {
    if (editor) saveMutation.mutate(editor.getHTML());
  };

  return (
    <div className={css.editor}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      <div className="mt-4 flex gap-2">
        <Button
          onClick={saveManually}
          isLoading={saveMutation.isLoading}
          variant={saveMutation.isError ? 'destructive' : 'default'}
        >
          {saveMutation.isError ? 'Erro ao salvar' : 'Salvar manualmente'}
        </Button>

        <NewImageContentDialogTrigger />

        <NewVideoContentDialogTrigger />
      </div>

      <pre>{JSON.stringify(editor?.getJSON(), null, 2)}</pre>
    </div>
  );
}
