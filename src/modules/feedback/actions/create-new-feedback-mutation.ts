'use server';

import { readFileSync } from 'fs';
import { revalidatePath } from 'next/cache';
import path from 'path';
import { z } from 'zod';
import { validateRequest } from '@/modules/auth/services/next';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { fail, isFail, ok, type Result, wrapAsyncInResult, wrapInResult } from '@/shared/lib/result';
import type { NewFeedbackFormValues } from '../components/new-feedback-form';
import { FeedbackRepository } from '../repositories/feedback-repository';

const packageJsonSchema = z.object({
  version: z.string(),
});

export async function createNewFeedbackMutation(feedback: NewFeedbackFormValues): Promise<Result<string>> {
  const { data: user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Você precisa estar logado para criar uma nova trilha.');
  }

  const currentVersionResult = wrapInResult(() => {
    const filePath = path.join(process.cwd(), 'package.json');
    const file = readFileSync(filePath, 'utf8');
    const json = JSON.parse(file) as unknown;
    const parsed = packageJsonSchema.parse(json);
    return parsed.version;
  });

  const feedbackRepository = new FeedbackRepository();

  const feedbackResult = await wrapAsyncInResult(
    feedbackRepository.createFeedback({
      content: feedback.text,
      type: feedback.type,
      softwareVersion: currentVersionResult.type === 'ok' ? currentVersionResult.value : 'unknown',
      userId: user.id,
    }),
  );

  if (isFail(feedbackResult)) {
    return fail('Falha ao criar feedback.');
  }

  revalidatePath('/dashboard/feedback');
  return ok('Feedback criado com sucesso.');
}
