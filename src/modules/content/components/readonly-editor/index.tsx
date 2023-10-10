'use client';

import type { Content } from '@tiptap/core';
import { useRichTextEditor } from '../../hooks/use-rich-text-editor';
import { EditorContent } from '../editor-content';

type ReadonlyEditorProps = {
  content: Content;
};

export function ReadonlyEditor({ content }: ReadonlyEditorProps) {
  const editor = useRichTextEditor({
    editable: false,
    initialContent: content,
  });

  return <EditorContent editor={editor} />;
}
