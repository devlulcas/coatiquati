'use client';

import { newRichTextContentAction } from '@/modules/rich-text-content/components/new-rich-text-content-form/new-rich-text-content-action';
import { RichTextContentBaseForm } from '@/modules/rich-text-content/components/rich-text-content-base-form';
import type { NewRichTextContentSchema } from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';
import { useToast } from '@/shared/components/ui/use-toast';

type NewRichTextContentFormProps = {
  topicId: number;
};

export function NewRichTextContentForm({ topicId }: NewRichTextContentFormProps) {
  const { toast } = useToast();

  const onSubmit = async (data: NewRichTextContentSchema) => {
    try {
      await newRichTextContentAction(data);
      toast({ title: 'Conteúdo textual criado com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao criar conteúdo textual',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return <RichTextContentBaseForm defaultValues={{ topicId }} onSubmit={onSubmit} />;
}
