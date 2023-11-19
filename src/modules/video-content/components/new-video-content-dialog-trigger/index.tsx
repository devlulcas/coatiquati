'use client';

import { VideoContentBaseForm } from '@/modules/video-content/components/video-content-base-form';
import type { NewVideoContentSchema } from '@/modules/video-content/schemas/new-video-content-schema';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { VideoIcon } from 'lucide-react';
import { useState } from 'react';
import { newVideoContentAction } from './new-video-content-action';

type NewVideoContentDialogTriggerProps = {
  topicId: number;
};

export function NewVideoContentDialogTrigger({ topicId }: NewVideoContentDialogTriggerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: NewVideoContentSchema) => {
    try {
      await newVideoContentAction(data);
      toast({ title: 'Conteúdo de vídeo criado com sucesso' });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao criar conteúdo de vídeo criado',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center justify-center">
          <VideoIcon /> Contribuir com um vídeo
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <VideoContentBaseForm defaultValues={{ topicId }} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
