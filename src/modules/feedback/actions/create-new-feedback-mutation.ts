'use server';
import packageJson from '@/../package.json';
import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import {
  fail,
  isFail,
  ok,
  type Result,
  wrapAsyncInResult,
} from '@/shared/lib/result';
import { revalidatePath } from 'next/cache';
import type { NewFeedbackFormValues } from '../components/new-feedback-form';
import { createFeedback } from '../repositories/feedback-repository';

export async function createNewFeedbackMutation(
  feedback: NewFeedbackFormValues
): Promise<Result<string>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const feedbackResult = await wrapAsyncInResult(
    createFeedback({
      content: feedback.text,
      type: feedback.type,
      softwareVersion: packageJson.version,
      userId: user.id,
    })
  );

  if (isFail(feedbackResult)) {
    return fail('Falha ao criar feedback.');
  }

  revalidatePath('/dashboard/feedback');
  return ok('Feedback criado com sucesso.');
}
