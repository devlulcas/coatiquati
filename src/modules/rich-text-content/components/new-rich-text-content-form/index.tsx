'use client';

import { useToast } from '@/shared/components/ui/use-toast';
import type { NewRichTextContentSchema } from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';
import { RichTextContentBaseForm } from '@/modules/rich-text-content/components/rich-text-content-base-form';
import { newRichTextContentAction } from '@/modules/rich-text-content/components/new-rich-text-content-form/new-rich-text-content-action';

type NewRichTextContentFormProps = {
  topicId: number;
};

export function NewRichTextContentForm({ topicId }: NewRichTextContentFormProps) {
  const { toast } = useToast();

  const onSubmit = async (data: NewRichTextContentSchema) => {
    try {
      await newRichTextContentAction(data);
      toast({ title: 'Trilha criada com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao criar trilha',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return <RichTextContentBaseForm defaultValues={{ topicId }} onSubmit={onSubmit} />;
}
