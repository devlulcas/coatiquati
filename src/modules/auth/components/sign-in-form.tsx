'use client';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import coatisHanging from '../assets/coatis-hanging.webp';
import { authClient } from '../lib/auth-client';
import { userSignInSchema } from '../schemas/user-sign-in-schema';
import { PasswordInput } from './password-input';

export function SignInForm() {
  const form = useForm<z.infer<typeof userSignInSchema>>({
    resolver: zodResolver(userSignInSchema),
  });

  const action = useMutation({
    mutationFn: async (data: z.infer<typeof userSignInSchema>) => {
      if (data.username) {
        return authClient.signIn.username({
          username: data.username,
          password: data.password,
          callbackURL: '/',
          rememberMe: true,
        });
      }

      if (data.email) {
        return authClient.signIn.email({
          email: data.email,
          password: data.password,
          callbackURL: '/',
          rememberMe: true,
        });
      }
    },
  });

  return (
    <div className="flex h-[--view-height] flex-col items-center justify-center">
      <Form {...form}>
        <form
          className="relative flex h-fit min-w-[400px] flex-col gap-4 rounded-md border bg-card px-4 py-6 shadow-md"
          onSubmit={form.handleSubmit((data) => action.mutateAsync(data))}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 grayscale filter hover:grayscale-0"
            style={{ bottom: 'calc(100% - 7.5px)' }}
          >
            <Image
              src={coatisHanging}
              alt="coatis"
              title="Coatis filhotes - zooborns.com"
            />
          </div>

          <h1 className="text-3xl font-bold">Entrar</h1>

          {action.isError && (
            <ErrorMessage className="my-3" message={action.error.message} />
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input placeholder="@exemplo" {...field} />
                </FormControl>
                <FormDescription>
                  Você pode usar seu nome de usuário ou email para entrar.
                </FormDescription>
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
            isLoading={action.isPending}
            disabled={action.isPending || action.isSuccess}
            className="mt-4 w-full"
            type="submit"
          >
            Entrar
          </Button>
        </form>
      </Form>

      <Link className="mt-4 text-sm text-primary" href="/sign-up">
        Não tem uma conta? Cadastre-se
      </Link>
    </div>
  );
}
