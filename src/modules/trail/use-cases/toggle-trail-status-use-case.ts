import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { TrailRepository } from '../repositories/trail-repository';
import { trailWithIdSchema, type TrailWithIdSchema } from '../schemas/trail-with-id-schema';

export class ToggleTrailStatusUseCase {
  constructor(private readonly trailRepository: TrailRepository = new TrailRepository()) {}

  async execute(params: TrailWithIdSchema, session: Session) {
    if (!isAdminOrAbove(session.user.role)) {
      throw new Error('Somente administradores podem editar trilhas.');
    }

    const validatedParams = trailWithIdSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para editar trilha.');
    }

    const trail = await this.trailRepository.getTrailById(validatedParams.data.id);

    if (trail.status === 'PUBLISHED') {
      return this.trailRepository.omitTrail(validatedParams.data.id);
    } else if (trail.status === 'DRAFT') {
      return this.trailRepository.enableTrail(validatedParams.data.id);
    }

    throw new Error('Status inválido para trilha.');
  }
}
