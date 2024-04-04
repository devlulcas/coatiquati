'use client';

import { ImageContentBaseForm } from '@/modules/image-content/components/image-content-base-form';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { useState } from 'react';
import { upsertImageContentMutation } from '../../actions/upsert-image-content-mutation';
import type { NewImageContentSchema } from '../../schemas/new-image-content-schema';

type NewImageContentDialogTriggerProps = {
  children: React.ReactNode;
  defaultValues?: Partial<NewImageContentSchema>;
};

export function NewImageContentDialogTrigger({ defaultValues, children }: NewImageContentDialogTriggerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useServerActionMutation({
    shouldRefresh: true,
    serverAction: upsertImageContentMutation,
    onFailedAction: error => {
      toast({
        title: `Erro lidando com a imagem do conteúdo: ${error instanceof Error ? error.message : String(error)}`,
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({ title: 'Ação bem sucedida' });
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <ImageContentBaseForm defaultValues={defaultValues} onSubmit={mutation.mutate} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
