'use client';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { userSignUpSchema } from '../../schemas/user-sign-up-schema';
import { registerMutation } from '../../actions/register-mutation';
import { useFormState } from 'react-dom';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { fail, isFail } from '@/shared/lib/result';

type SignUpFormSchema = z.infer<typeof userSignUpSchema>;

export function SignUpForm() {
  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(userSignUpSchema),
  });

  const [state, formAction, isPending] = useFormState(registerMutation, fail('undefined'));

  return (
    <div className="flex h-[--view-height] flex-col items-center justify-center">
      <Form {...form}>
        <form
          className="flex h-fit min-w-[400px] flex-col gap-4 rounded-md border bg-card px-4 py-6 shadow-md"
          action={formAction}
        >
          <h1 className="text-3xl font-bold">Cadastrar-se</h1>

          {isFail(state) && <ErrorMessage className="my-3" message={state.fail} />}

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

          <Button className="mt-4 w-full" type="submit" isLoading={isPending}>
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
