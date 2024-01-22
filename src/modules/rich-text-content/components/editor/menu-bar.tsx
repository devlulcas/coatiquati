'use client';

import { type Editor } from '@tiptap/react';
import {
  BoldIcon,
  Code2Icon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ItalicIcon,
  LayoutListIcon,
  ListIcon,
  ListOrderedIcon,
  ListPlusIcon,
  ListStartIcon,
  ListTreeIcon,
  PilcrowIcon,
  QuoteIcon,
  RedoIcon,
  RemoveFormattingIcon,
  SplitSquareHorizontalIcon,
  StrikethroughIcon,
  UndoIcon,
  WorkflowIcon,
  WrapTextIcon,
  YoutubeIcon,
} from 'lucide-react';
import { EditorActionButton } from './editor-action-button';
import { ImageUploaderDialogTrigger } from './image-uploader-dialog-trigger';

type MenuBarProps = {
  editor: Editor | null;
};

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  const setYoutubeVideo = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.commands.setYoutubeVideo({ src: url, width: 560, height: 315 });
    }
  };

  return (
    <div className="flex gap-2 flex-wrap w-full">
      <EditorActionButton
        icon={<BoldIcon />}
        label="negrito"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={<ItalicIcon />}
        label="itálico"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        icon={<StrikethroughIcon />}
        label="riscado"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        icon={<CodeIcon />}
        label="código"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        icon={<RemoveFormattingIcon />}
        label="remover formatação"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().clearNodes().run()}
        icon={<WorkflowIcon />}
        label="limpar nós"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive('paragraph')}
        icon={<PilcrowIcon />}
        label="parágrafo"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        icon={<Heading1Icon />}
        label="h1"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        icon={<Heading2Icon />}
        label="h2"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        icon={<Heading3Icon />}
        label="h3"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        active={editor.isActive('heading', { level: 4 })}
        icon={<Heading4Icon />}
        label="h4"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        active={editor.isActive('heading', { level: 5 })}
        icon={<Heading5Icon />}
        label="h5"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        active={editor.isActive('heading', { level: 6 })}
        icon={<Heading6Icon />}
        label="h6"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={<ListIcon />}
        label="lista não ordenada"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={<ListOrderedIcon />}
        label="lista ordenada"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        icon={<Code2Icon />}
        label="bloco de código"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        icon={<QuoteIcon />}
        label="citação"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<SplitSquareHorizontalIcon />}
        label="linha horizontal"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().setHardBreak().run()}
        icon={<WrapTextIcon />}
        label="quebra de linha"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        icon={<UndoIcon />}
        label="desfazer"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        icon={<RedoIcon />}
        label="refazer"
      />

      <ImageUploaderDialogTrigger editor={editor} />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        disabled={!editor.can().toggleTaskList()}
        active={editor.isActive('taskList')}
        icon={<LayoutListIcon />}
        label="lista de tarefas"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().splitListItem('taskItem').run()}
        disabled={!editor.can().splitListItem('taskItem')}
        icon={<ListPlusIcon />}
        label="adicionar item"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().sinkListItem('taskItem').run()}
        disabled={!editor.can().sinkListItem('taskItem')}
        icon={<ListTreeIcon />}
        label="subir item"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().liftListItem('taskItem').run()}
        disabled={!editor.can().liftListItem('taskItem')}
        icon={<ListStartIcon />}
        label="descer item"
      />

      <EditorActionButton onClick={setYoutubeVideo} icon={<YoutubeIcon />} label="vídeo do youtube" />
    </div>
  );
}
