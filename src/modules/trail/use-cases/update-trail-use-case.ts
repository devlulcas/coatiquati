import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { TrailRepository } from '../repositories/trail-repository';
import { updateTrailSchema, type UpdateTrailSchema } from '../schemas/edit-trail-schema';
import type { UpdateTrail } from '../types/trail';

export class UpdateTrailUseCase {
  constructor(private readonly trailRepository: TrailRepository = new TrailRepository()) {}

  async execute(params: UpdateTrailSchema, session: Session) {
    if (!isAdminOrAbove(session.user.role)) {
      throw new Error('Somente administradores podem editar trilhas. Entre como administrador.');
    }

    const validatedParams = updateTrailSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos de atualização.');
    }

    const updatedTrail: UpdateTrail = {
      id: validatedParams.data.id,
      title: validatedParams.data.title,
      description: validatedParams.data.description,
      thumbnail: validatedParams.data.thumbnail,
      status: validatedParams.data.status,
      contributorId: session.user.id,
      category: validatedParams.data.category,
    };

    const trail = await this.trailRepository.updateTrail(updatedTrail);

    log.info('Trail updated', { trailId: trail.id, contributorId: session.user.id });

    return trail;
  }
}
