'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import type { NewFeedbackFormValues } from '.';
import { CreateNewFeedbackUseCase } from '../../use-cases/create-new-feedback-use-case';

export async function newFeedbackAction(data: NewFeedbackFormValues) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar uma nova trilha.');
  }

  const createNewFeedbackUseCase = new CreateNewFeedbackUseCase();
  await createNewFeedbackUseCase.execute(data, session);
}
