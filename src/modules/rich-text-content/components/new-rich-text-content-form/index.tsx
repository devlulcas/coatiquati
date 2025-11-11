'use client';

import { RichTextContentBaseForm } from '@/modules/rich-text-content/components/rich-text-content-base-form';
import { useToast } from '@/shared/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { upsertRichTextContentMutation } from '../../actions/upsert-rich-text-content-mutation';
import type { NewRichTextContentSchema } from '../../schemas/new-rich-text-content-schema';

type NewRichTextContentFormProps = {
  defaultValues: Partial<NewRichTextContentSchema>;
};

export function NewRichTextContentForm({
  defaultValues,
}: NewRichTextContentFormProps) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: upsertRichTextContentMutation,
    onError: (error) => {
      toast({
        title: 'Erro ao criar conteúdo textual',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({ title: 'Conteúdo textual criado com sucesso' });
    },
  });

  return (
    <RichTextContentBaseForm
      defaultValues={defaultValues}
      onSubmit={(params) => mutation.mutateAsync(params)}
    />
  );
}
