'use client';

import { AVATARS } from '@/modules/user/constants/avatars';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { authClient } from '../lib/auth-client';
import { userSignUpSchema } from '../schemas/user-sign-up-schema';
import { PasswordInput } from './password-input';

export function SignUpForm() {
  const form = useForm<z.infer<typeof userSignUpSchema>>({
    resolver: zodResolver(userSignUpSchema),
  });

  const { toast } = useToast();

  const action = useMutation({
    mutationFn: async (data: z.infer<typeof userSignUpSchema>) => {
      return authClient.signUp.email({
        email: data.email,
        password: data.password,
        username: data.username,
        name: data.name,
        callbackURL: '/',
        image: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      });
    },
    onSuccess: () => {
      toast({
        title: 'Usuário cadastrado com sucesso',
        description: 'Você pode agora fazer login em sua conta.',
        variant: 'success',
      });
    },
  });

  return (
    <div className="flex h-[--view-height] flex-col items-center justify-center">
      <Form {...form}>
        <form
          className="flex h-fit min-w-[400px] flex-col gap-4 rounded-md border bg-card px-4 py-6 shadow-md"
          onSubmit={form.handleSubmit(data => action.mutateAsync(data))}
        >
          <h1 className="text-3xl font-bold">Cadastrar-se</h1>

          {action.isError && <ErrorMessage className="my-3" message={action.error.message} />}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormDescription>
                  Você pode usar seu nome social. O importante é que seus pares possam reconhecer você.
                </FormDescription>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de usuário</FormLabel>
                <FormDescription>
                  Você poderá usar este nome de usuário para ser encontrado por outros usuários.
                </FormDescription>
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="mt-4 w-full"
            type="submit"
            isLoading={action.isPending}
            disabled={action.isPending || action.isSuccess}
          >
            Cadastrar-se
          </Button>
        </form>
      </Form>

      <Link className="mt-4 text-sm text-primary" href="/sign-in">
        Já tem uma conta? Entre
      </Link>
    </div>
  );
}
