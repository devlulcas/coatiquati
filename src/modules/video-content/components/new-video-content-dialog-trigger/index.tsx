'use client';

import { VideoContentBaseForm } from '@/modules/video-content/components/video-content-base-form';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { unwrap } from '@/shared/lib/result';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { upsertVideoContentMutation } from '../../actions/upsert-video-content-mutation';
import type { NewVideoContentSchema } from '../../schemas/new-video-content-schema';

type NewVideoContentDialogTriggerProps = {
  children: React.ReactNode;
  defaultValues?: Partial<NewVideoContentSchema>;
};

export function NewVideoContentDialogTrigger({
  defaultValues,
  children,
}: NewVideoContentDialogTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useUpsertVideoContentMutation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-fit">
        <VideoContentBaseForm
          defaultValues={defaultValues}
          onSubmit={(params) => {
            return mutation.mutateAsync(params, {
              onSuccess: () => setIsOpen(false),
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function useUpsertVideoContentMutation() {
  const { toast } = useToast();

  const createNewVideoContentMutationState = useMutation({
    mutationFn: async (params: NewVideoContentSchema) => {
      return unwrap(await upsertVideoContentMutation(params));
    },
    onSuccess: () => {
      toast({
        title: 'Conteúdo de vídeo criado com sucesso',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar conteúdo de vídeo criado',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return createNewVideoContentMutationState;
}
