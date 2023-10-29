'use client';

import { ImageContentBaseForm } from '@/modules/image-content/components/image-content-base-form';
import type { NewImageContentSchema } from '@/modules/image-content/schemas/new-image-content-schema';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { ImagePlusIcon } from 'lucide-react';
import { newImageContentAction } from './new-image-content-action';

type NewImageContentDialogTriggerProps = {
  topicId: number;
};

export function NewImageContentDialogTrigger({ topicId }: NewImageContentDialogTriggerProps) {
  const { toast } = useToast();

  const onSubmit = async (data: NewImageContentSchema) => {
    try {
      await newImageContentAction(data);
      toast({ title: 'Conteúdo de imagem criado com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao criar conteúdo de imagem criado',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center justify-center">
          <ImagePlusIcon /> Contribuir com uma imagem
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <ImageContentBaseForm defaultValues={{ topicId }} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
