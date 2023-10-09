'use client';

import { Button } from '@/shared/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useRichTextEditor } from '../../hooks/use-rich-text-editor';
import { EditorContent } from './editor-content';
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
    <div className="w-full flex flex-col gap-2">
      <MenuBar editor={editor} />

      <EditorContent editor={editor} />

      <Button
        onClick={saveManually}
        isLoading={saveMutation.isLoading}
        variant={saveMutation.isError ? 'destructive' : 'default'}
      >
        {saveMutation.isError ? 'Erro ao salvar' : 'Salvar manualmente'}
      </Button>
    </div>
  );
}
