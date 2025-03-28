'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup } from '@/shared/components/ui/radio-group';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { updateUserMutation } from '../../actions/update-user-mutation';
import { AVATARS } from '../../constants/avatars';
import { updateUserSchema } from '../../schemas/update-user-schema';
import { type User } from '../../types/user';

const editUserFormSchema = updateUserSchema;

type EditUserFormValues = z.infer<typeof editUserFormSchema>;

type EditUserDialogTriggerProps = {
  user: User;
  children: React.ReactNode;
};

export function EditUserDialogTrigger({ user, children }: EditUserDialogTriggerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      email: user.email,
      username: user.username,
    },
  });

  const onSubmit = async (data: EditUserFormValues) => {
    try {
      await updateUserMutation(data);
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
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Editar {user.username}</DialogTitle>
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

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-2"
                      >
                        {AVATARS.map(avatar => (
                          <label key={avatar} htmlFor={avatar}>
                            <input
                              className="peer sr-only"
                              type="radio"
                              id={avatar}
                              value={avatar}
                              checked={field.value === avatar}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />

                            <Image
                              src={avatar}
                              alt="Avatar"
                              width={64}
                              height={64}
                              className="cursor-pointer rounded border-2 border-gray-200 peer-checked:border-brand-500"
                            />
                          </label>
                        ))}
                      </RadioGroup>
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
