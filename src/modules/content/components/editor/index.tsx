'use client';

import { Button } from '@/shared/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { UploadMarkdownButton } from '../upload-markdown-button';
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
  const editor = useEditor({
    extensions: [
      TextStyle.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Image,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        progressBarColor: 'hotpink',
      }),
    ],
  });

  const saveMutation = useMutation({
    mutationFn: onSave,
  });

  const saveManually = () => {
    if (editor) saveMutation.mutate(editor.getHTML());
  };

  return (
    <div className={css.editor}>
      <MenuBar editor={editor} />
      <EditorContent content={initialContent} editor={editor}>
        {null}
      </EditorContent>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={saveManually}
          isLoading={saveMutation.isLoading}
          variant={saveMutation.isError ? 'destructive' : 'default'}
        >
          {saveMutation.isError ? 'Erro ao salvar' : 'Salvar manualmente'}
        </Button>

        <UploadMarkdownButton />
      </div>
    </div>
  );
}
