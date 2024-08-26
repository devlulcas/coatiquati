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
  ImagePlusIcon,
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
import { ImageUploaderDialogTrigger } from './editor-image-uploader-dialog-trigger';

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

  const iconSize = 18;

  return (
    <div className="flex w-full flex-wrap overflow-clip rounded">
      <EditorActionButton
        icon={<BoldIcon size={iconSize} />}
        label="negrito"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={<ItalicIcon size={iconSize} />}
        label="itálico"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        icon={<StrikethroughIcon size={iconSize} />}
        label="riscado"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        icon={<CodeIcon size={iconSize} />}
        label="código"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        icon={<RemoveFormattingIcon size={iconSize} />}
        label="remover formatação"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().clearNodes().run()}
        icon={<WorkflowIcon size={iconSize} />}
        label="limpar nós"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive('paragraph')}
        icon={<PilcrowIcon size={iconSize} />}
        label="parágrafo"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        icon={<Heading1Icon size={iconSize} />}
        label="h1"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        icon={<Heading2Icon size={iconSize} />}
        label="h2"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        icon={<Heading3Icon size={iconSize} />}
        label="h3"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        active={editor.isActive('heading', { level: 4 })}
        icon={<Heading4Icon size={iconSize} />}
        label="h4"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        active={editor.isActive('heading', { level: 5 })}
        icon={<Heading5Icon size={iconSize} />}
        label="h5"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        active={editor.isActive('heading', { level: 6 })}
        icon={<Heading6Icon size={iconSize} />}
        label="h6"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={<ListIcon size={iconSize} />}
        label="lista não ordenada"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={<ListOrderedIcon size={iconSize} />}
        label="lista ordenada"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        icon={<Code2Icon size={iconSize} />}
        label="bloco de código"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        icon={<QuoteIcon size={iconSize} />}
        label="citação"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<SplitSquareHorizontalIcon size={iconSize} />}
        label="linha horizontal"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().setHardBreak().run()}
        icon={<WrapTextIcon size={iconSize} />}
        label="quebra de linha"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        icon={<UndoIcon size={iconSize} />}
        label="desfazer"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        icon={<RedoIcon size={iconSize} />}
        label="refazer"
      />

      <ImageUploaderDialogTrigger editor={editor}>
        <EditorActionButton icon={<ImagePlusIcon size={iconSize} />} label="imagem" />
      </ImageUploaderDialogTrigger>

      <EditorActionButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        disabled={!editor.can().toggleTaskList()}
        active={editor.isActive('taskList')}
        icon={<LayoutListIcon size={iconSize} />}
        label="lista de tarefas"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().splitListItem('taskItem').run()}
        disabled={!editor.can().splitListItem('taskItem')}
        icon={<ListPlusIcon size={iconSize} />}
        label="adicionar item"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().sinkListItem('taskItem').run()}
        disabled={!editor.can().sinkListItem('taskItem')}
        icon={<ListTreeIcon size={iconSize} />}
        label="subir item"
      />

      <EditorActionButton
        onClick={() => editor.chain().focus().liftListItem('taskItem').run()}
        disabled={!editor.can().liftListItem('taskItem')}
        icon={<ListStartIcon size={iconSize} />}
        label="descer item"
      />

      <EditorActionButton onClick={setYoutubeVideo} icon={<YoutubeIcon size={iconSize} />} label="vídeo do youtube" />
    </div>
  );
}
