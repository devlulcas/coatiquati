import { AuthForm } from '../auth-form';

type SignOutActionProps = {
  children: React.ReactNode;
  className?: string;
  formClassName?: string;
};

export function SignOutAction({
  children,
  className,
  formClassName,
}: SignOutActionProps) {
  return (
    <AuthForm action="/api/sign-out" className={formClassName}>
      <button className={className} type="submit">
        {children}
      </button>
    </AuthForm>
  );
}
