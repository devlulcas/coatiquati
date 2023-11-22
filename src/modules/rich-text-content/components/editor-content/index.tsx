import { cn } from '@/shared/utils/cn';
import { type Editor, EditorContent as TipTapEditorContent } from '@tiptap/react';
import css from './editor-content.module.css';

type EditorContentProps = {
  editor: Editor | null;
};

export function EditorContent({ editor }: EditorContentProps) {
  return <TipTapEditorContent editor={editor} className={cn('prose dark:prose-invert', css.editor)} />;
}
