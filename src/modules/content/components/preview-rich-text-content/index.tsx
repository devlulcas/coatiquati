'use client';

import type { Content } from '@tiptap/core';
import { useRichTextEditor } from '../../hooks/use-rich-text-editor';
import { EditorContent } from '../editor/editor-content';

type PreviewRichTextContentProps = {
  richTextContent: Content;
};

export function PreviewRichTextContent({ richTextContent }: PreviewRichTextContentProps) {
  const editor = useRichTextEditor({
    editable: false,
    initialContent: richTextContent,
  });

  return <EditorContent editor={editor} />;
}
