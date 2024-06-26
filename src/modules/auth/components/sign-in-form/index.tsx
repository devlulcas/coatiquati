'use client';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { userSignInSchema } from '../../schemas/user-sign-in-schema';

export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userSignInSchema>>({
    resolver: zodResolver(userSignInSchema),
  });

  const onSubmit = async (values: z.infer<typeof userSignInSchema>) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);

    const response = await fetch('/api/sign-in', {
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

    if (response.status === 401) {
      return toast({
        title: 'Erro',
        description: 'Usuário ou senha incorretos',
        variant: 'destructive',
      });
    }

    return toast({
      title: 'Erro',
      description: 'Ocorreu um erro inesperado. Talvez esse usuário não exista',
      variant: 'destructive',
    });
  };

  return (
    <div className="flex h-[--view-height] flex-col items-center justify-center">
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-fit min-w-[400px] flex-col gap-4 rounded-md border bg-card px-4 py-6 shadow-md"
          action="/api/sign-in"
        >
          <h1 className="text-3xl font-bold">Entrar</h1>
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

          <Button className="mt-4 w-full" type="submit">
            {form.formState.isSubmitting ? <Loader className="animate-spin" size={16} /> : 'Entrar'}
          </Button>
        </form>
      </Form>

      <Link className="mt-4 text-sm text-primary" href="/sign-up">
        Não tem uma conta? Cadastre-se
      </Link>
    </div>
  );
}
