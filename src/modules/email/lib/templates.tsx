import { ConfirmCodeEmail } from '@/modules/email/components/confirm-code-email';
import { ResetPasswordEmail } from '@/modules/email/components/reset-password-email';
import { VerifyAccountEmail } from '@/modules/email/components/verify-account-email';

export const emailTemplates = {
  'confirm-code': <ConfirmCodeEmail name="John Doe" code="123abc" />,
  'reset-password': <ResetPasswordEmail name="John Doe" url="https://example.com/reset-password?token=123abc" />,
  'verify-account': <VerifyAccountEmail name="John Doe" url="https://example.com/auth/verify-account?token=123abc" />,
};
