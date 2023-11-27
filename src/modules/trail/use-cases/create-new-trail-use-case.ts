import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { type NewTrailTable } from '@/modules/database/schema/trail';
import { log } from '@/modules/logging/lib/pino';
import { TrailRepository } from '../repositories/trail-repository';
import { newTrailSchema, type NewTrailSchema } from '../schemas/new-trail-schema';

export class CreateNewTrailUseCase {
  constructor(private readonly trailRepository: TrailRepository = new TrailRepository()) {}

  async execute(params: NewTrailSchema, session: Session) {
    if (!isAdminOrAbove(session.user.role)) {
      throw new Error('Somente administradores podem criar trilhas.');
    }

    const validatedParams = newTrailSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para criar nova trilha.');
    }

    const newTrail: NewTrailTable = {
      title: validatedParams.data.title,
      description: validatedParams.data.description,
      thumbnail: validatedParams.data.thumbnail,
      status: validatedParams.data.status,
      authorId: session.user.id,
      category: validatedParams.data.category,
    };

    const trail = await this.trailRepository.createTrail(newTrail);

    log.info('Trail created', { trailId: trail.id, authorId: session.user.id });

    return trail;
  }
}
