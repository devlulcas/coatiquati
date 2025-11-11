'use client';

import { EditorContent } from '@/modules/rich-text-content/components/editor-content';
import { useRichTextEditor } from '@/modules/rich-text-content/hooks/use-rich-text-editor';
import type { Content } from '@tiptap/core';

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
