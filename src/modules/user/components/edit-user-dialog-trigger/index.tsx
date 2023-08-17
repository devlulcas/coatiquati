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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type User } from '../../types/user';
import { PinConfirmationDialog } from './pin-confirmation-dialog';

const editUserDialogSchema = userSignUpSchema.omit({ password: true });

type EditUserDialogTriggerProps = {
  user: User;
};

export function EditUserDialogTrigger({ user }: EditUserDialogTriggerProps) {
  const [waintingForPin, setWaintingForPin] = useState(false);
  const [pin, setPin] = useState('');

  const form = useForm<z.infer<typeof editUserDialogSchema>>({
    resolver: zodResolver(editUserDialogSchema),
    defaultValues: {
      email: user.email,
      username: user.username,
    },
  });

  const onSubmit = (data: z.infer<typeof editUserDialogSchema>) => {
    if (!pin) {
      setWaintingForPin(true);
      return;
    }

    console.log({
      ...data,
      pin,
    });
  };

  return (
    <Dialog>
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          {...field}
                        />
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

            <PinConfirmationDialog
              isOpen={waintingForPin}
              onConfirm={({ pin }) => {
                setPin(pin);
              }}
              onCancel={() => {
                setWaintingForPin(false);
                setPin('');
              }}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
