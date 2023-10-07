import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Youtube from '@tiptap/extension-youtube';
import { useEditor, type Content } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LayeredImage from '../components/layered-image-node';

type UseRichTextEditorOptions = {
  initialContent?: Content;
  editable?: boolean;
};

export function useRichTextEditor(options: UseRichTextEditorOptions = { editable: true, initialContent: undefined }) {
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
      LayeredImage,
    ],
    content: options.initialContent,
    editable: options.editable,
  });

  return editor;
}
