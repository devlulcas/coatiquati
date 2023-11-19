'use client';

import { userSignUpSchema } from '@/modules/auth/schemas/user-sign-up-schema';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type User } from '../../types/user';
import { editUserAction } from './edit-user-action';

const editUserDialogSchema = userSignUpSchema.omit({ password: true });

type EditUserFormValues = z.infer<typeof editUserDialogSchema>;

type EditUserDialogTriggerProps = {
  user: User;
};

export function EditUserDialogTrigger({ user }: EditUserDialogTriggerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserDialogSchema),
    defaultValues: {
      email: user.email,
      username: user.username,
    },
  });

  const onSubmit = async (data: EditUserFormValues) => {
    try {
      await editUserAction(data);
      toast({ title: `Usuário ${data.username} alterado com sucesso` });
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
        <Button variant="ghost">
          Editar
          <PencilIcon size={16} className="ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Editar {user.username}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="@exemplo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" type="submit">
                  Salvar
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
