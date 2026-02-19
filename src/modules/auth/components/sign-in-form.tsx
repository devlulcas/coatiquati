'use client';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
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
      return authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/',
        rememberMe: true,
      });
    },
  });

  const { toast } = useToast();

  const passkeyMutation = useMutation({
    mutationFn: async () => {
      return authClient.signIn.passkey({
        autoFill: true,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Login com passkey feito com sucesso',
        variant: 'success',
      });
    },
    onError: error => {
      toast({
        title: 'Erro ao fazer login com passkey',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="flex h-[--view-height] flex-col items-center justify-center">
      <Form {...form}>
        <form
          className="relative flex h-fit min-w-[400px] flex-col gap-4 rounded-md border bg-card px-4 py-6 shadow-md"
          onSubmit={form.handleSubmit(data => action.mutateAsync(data))}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 grayscale filter hover:grayscale-0"
            style={{ bottom: 'calc(100% - 7.5px)' }}
          >
            <Image src={coatisHanging} alt="coatis" title="Coatis filhotes - zooborns.com" />
          </div>

          <h1 className="text-3xl font-bold">Entrar</h1>

          {action.isError && <ErrorMessage className="my-3" message={action.error.message} />}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input placeholder="email@exemplo.com" type="email" autoComplete="email webauthn" {...field} />
                  </div>
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
                  <PasswordInput {...field} autoComplete="current-password webauthn" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button
              isLoading={passkeyMutation.isPending}
              disabled={passkeyMutation.isPending || passkeyMutation.isSuccess}
              className="mt-4 w-full"
              type="button"
              onClick={() => passkeyMutation.mutate()}
            >
              Entrar com passkey
            </Button>

            <Button
              isLoading={action.isPending}
              disabled={action.isPending || action.isSuccess || passkeyMutation.isPending || passkeyMutation.isSuccess}
              className="mt-4 w-full"
              type="submit"
            >
              Entrar
            </Button>
          </div>
        </form>
      </Form>

      <Link className="mt-4 text-sm text-primary" href="/sign-up">
        Não tem uma conta? Cadastre-se
      </Link>
    </div>
  );
}
