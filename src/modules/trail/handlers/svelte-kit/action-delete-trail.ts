import type { SpecificTrailAction } from "$/routes/admin/trails/[trail]/+page.server";
import { adminBarrier } from '$lib/server/auth/utils/barriers';
import { protect } from '$lib/server/auth/utils/protect';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { DeleteTrail } from "$modules/trail/use-cases/delete-trail";
import { fail } from '@sveltejs/kit';

/**
 * Marca uma trilha como inativa
 */
export const deleteTrailAction: SpecificTrailAction = async ({ locals, url, params }) => {
  // Valida a sessão do usuário
  const validatedUserSession = await protect({
    locals: locals,
    barriers: [adminBarrier],
    event: { url: url }
  });

  if (validatedUserSession.user === null) {
    throw redirectToSignIn(url.pathname, 'NOT_AUTHENTICATED');
  }

  // Instancia os serviços e o caso de uso
  const trailRepository = new PostgresTrailRepository();
  const deleteTrail = new DeleteTrail(trailRepository);

  // Cria a trilha
  const deleteTrailResult = await deleteTrail.execute(params.trail)

  if (deleteTrailResult.error) {
    return fail(500, {
      error: deleteTrailResult.error.message
    });
  }
}
