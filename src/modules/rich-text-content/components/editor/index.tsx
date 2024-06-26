'use client';

import type { Content, Editor as EditorType } from '@tiptap/core';
import { useEffect } from 'react';
import { useRichTextEditor } from '@/modules/rich-text-content/hooks/use-rich-text-editor';
import { EditorContent } from '@/modules/rich-text-content/components/editor-content';
import { MenuBar } from './menu-bar';

type EditorProps = {
  initialContent?: Content;
  onDelayedChange: (editor: EditorType) => Promise<void> | void;
};

export function Editor({ initialContent, onDelayedChange }: EditorProps) {
  const editor = useRichTextEditor({ initialContent });

  useEffect(() => {
    const save = () => {
      if (editor) onDelayedChange(editor);
    };

    const timeout = setTimeout(save, 800);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        save();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [editor, onDelayedChange]);

  return (
    <div className="flex w-full flex-col gap-2">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
