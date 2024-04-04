'use client';

import { RichTextContentBaseForm } from '@/modules/rich-text-content/components/rich-text-content-base-form';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { upsertRichTextContentMutation } from '../../actions/upsert-rich-text-content-mutation';
import type { NewRichTextContentSchema } from '../../schemas/new-rich-text-content-schema';

type NewRichTextContentFormProps = {
  defaultValues: Partial<NewRichTextContentSchema>;
};

export function NewRichTextContentForm({ defaultValues }: NewRichTextContentFormProps) {
  const { toast } = useToast();

  const mutation = useServerActionMutation({
    serverAction: upsertRichTextContentMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao criar conteúdo textual',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({ title: 'Conteúdo textual criado com sucesso' });
    },
  });

  return <RichTextContentBaseForm defaultValues={defaultValues} onSubmit={mutation.mutate} />;
}
