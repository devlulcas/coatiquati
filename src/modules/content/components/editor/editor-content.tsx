import { Editor, EditorContent as TipTapEditorContent } from '@tiptap/react';

type EditorContentProps = {
  editor: Editor | null;
};

export function EditorContent({ editor }: EditorContentProps) {
  return <TipTapEditorContent editor={editor} className="prose dark:prose-invert" />;
}
