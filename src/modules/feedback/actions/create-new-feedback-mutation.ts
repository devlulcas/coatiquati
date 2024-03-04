'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { readFileSync } from 'fs';
import { revalidatePath } from 'next/cache';
import path from 'path';
import type { NewFeedbackFormValues } from '../components/new-feedback-form';
import { FeedbackRepository } from '../repositories/feedback-repository';

export async function createNewFeedbackMutation(feedback: NewFeedbackFormValues): Promise<void> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Você precisa estar logado para criar uma nova trilha.');
  }

  const file = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(file, 'utf8'));

  const feedbackRepository = new FeedbackRepository();

  const feedbackId = await feedbackRepository.createFeedback({
    content: feedback.text,
    type: feedback.type,
    softwareVersion: packageJson.version,
    userId: session.user.id,
  });

  revalidatePath('/dashboard/feedback');

  log.info('Feedback created', { feedbackId: feedbackId, authorId: session.user.id });
}
