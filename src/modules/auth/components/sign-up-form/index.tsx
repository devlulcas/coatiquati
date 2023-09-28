'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userSignUpSchema } from '../../schemas/user-sign-up-schema';

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userSignUpSchema>>({
    resolver: zodResolver(userSignUpSchema),
  });

  const onSubmit = async (values: z.infer<typeof userSignUpSchema>) => {
    const formData = new FormData();

    formData.append('email', values.email);
    formData.append('username', values.username);
    formData.append('password', values.password);

    const response = await fetch('/api/sign-up', {
      method: 'POST',
      body: formData,
      redirect: 'manual',
    });

    if (response.status === 0) {
      toast({
        title: 'Sucesso',
        description: 'Bem vindo!',
      });

      return router.refresh();
    }

    return toast({
      title: 'Erro',
      description: 'Ocorreu um erro inesperado. Talvez esse usuário já exista',
      variant: 'destructive',
    });
  };

  return (
    <div className="flex items-center justify-center flex-col h-[--view-height]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 h-fit bg-card border rounded-md shadow-md px-4 py-6 min-w-[400px]"
          action="/api/sign-up"
        >
          <h1 className="text-3xl font-bold">Cadastrar-se</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
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
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mt-4" type="submit" isLoading={form.formState.isSubmitting}>
            Entrar
          </Button>
        </form>
      </Form>

      <Link className="mt-4 text-sm text-primary" href="/sign-in">
        Já tem uma conta? Entre
      </Link>
    </div>
  );
}
