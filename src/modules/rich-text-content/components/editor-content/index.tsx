import { type Editor, EditorContent as TipTapEditorContent } from '@tiptap/react';
import { cn } from '@/shared/utils/cn';
import css from './editor-content.module.css';

type EditorContentProps = {
  editor: Editor | null;
};

export function EditorContent({ editor }: EditorContentProps) {
  return (
    <TipTapEditorContent
      editor={editor}
      className={cn('prose dark:prose-invert prose-img:mx-auto prose-img:max-h-[500px] prose-img:rounded', css.editor)}
    />
  );
}
