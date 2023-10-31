'use client';

import { useRouter } from 'next/navigation';

type FormProps = {
  children: React.ReactNode;
  action: string;
} & React.HTMLAttributes<HTMLFormElement>;

export function AuthForm({ children, action, ...rest }: FormProps) {
  const router = useRouter();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await fetch(action, {
      method: 'POST',
      body: formData,
      redirect: 'manual',
    });

    if (response.status === 0) {
      return router.refresh();
    }
  };

  return (
    <form {...rest} action={action} method="POST" onSubmit={handleOnSubmit}>
      {children}
    </form>
  );
}
