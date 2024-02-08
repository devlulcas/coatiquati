import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { readFileSync } from 'fs';
import path from 'path';
import type { NewFeedbackFormValues } from '../components/new-feedback-form';
import { FeedbackRepository } from '../repositories/feedback-repository';

export class CreateNewFeedbackUseCase {
  constructor(private readonly feedbackRepository: FeedbackRepository = new FeedbackRepository()) {}

  async execute(params: NewFeedbackFormValues, session: Session) {
    if (!isAuthenticated(session)) {
      throw new Error('Somente administradores podem criar trilhas.');
    }

    const file = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(file, 'utf8'));

    const feedbackId = await this.feedbackRepository.createFeedback({
      content: params.feedback,
      softwareVersion: packageJson.version,
      userId: session.user.id,
    });

    log.info('Feedback created', { feedbackId: feedbackId, authorId: session.user.id });
  }
}
