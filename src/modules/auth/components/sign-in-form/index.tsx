'use client';

import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { fail, isFail } from '@/shared/lib/result';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { loginMutation } from '../../actions/login-mutation';
import coatisHanging from '../../assets/coatis-hanging.webp';
import { userSignInSchema } from '../../schemas/user-sign-in-schema';
import { PasswordInput } from '../password-input';

export function SignInForm() {
  const form = useForm<z.infer<typeof userSignInSchema>>({
    resolver: zodResolver(userSignInSchema),
  });

  const [state, formAction, isPending] = useFormState(loginMutation, fail('undefined'));

  return (
    <div className="flex h-[--view-height] flex-col items-center justify-center">
      <Form {...form}>
        <form
          method="POST"
          className="flex h-fit min-w-[400px] flex-col gap-4 rounded-md relative border bg-card px-4 py-6 shadow-md"
          action={formAction}
        >
          <div className='absolute left-1/2 -translate-x-1/2 filter grayscale hover:grayscale-0' style={{ bottom: 'calc(100% - 7.5px)' }}>
            <Image src={coatisHanging} alt='coatis' title='Coatis filhotes - zooborns.com' />
          </div>

          <h1 className="text-3xl font-bold">Entrar</h1>

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

          <Button disabled={isPending} className="mt-4 w-full" type="submit">
            {isPending ? <Loader className="animate-spin" size={16} /> : 'Entrar'}
          </Button>
        </form>
      </Form>

      <Link className="mt-4 text-sm text-primary" href="/sign-up">
        Não tem uma conta? Cadastre-se
      </Link>
    </div>
  );
}
