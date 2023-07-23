import type { SpecificTrailAction } from "$/routes/admin/trails/[trail]/+page.server";
import { adminBarrier } from '$lib/server/auth/utils/barriers';
import { protect } from '$lib/server/auth/utils/protect';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { updateTrailSchema } from "$modules/trail/dtos/update-trail.dto";
import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { UpdateTrail } from "$modules/trail/use-cases/update-trail";
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

/**
 * Atualiza uma trilha a partir de um formulário enviado pelo cliente
 */
export const updateTrailAction: SpecificTrailAction = async ({ request, locals, url, params }) => {
  // Valida a sessão do usuário
  const validatedUserSession = await protect({
    locals: locals,
    barriers: [adminBarrier],
    event: { url: url }
  });

  if (validatedUserSession.user === null) {
    throw redirectToSignIn(url.pathname, 'NOT_AUTHENTICATED');
  }

  // Valida o formulário (com o id do usuário, sem a imagem)
  const formData = await request.formData();

  // Adiciona o id da trilha ao formulário
  formData.append('id', params.trail);

  const form = await superValidate(formData, updateTrailSchema);

  if (!form.valid) {
    return fail(400, {
      form
    });
  }

  // Instancia os serviços e o caso de uso
  const trailRepository = new PostgresTrailRepository();
  const updateTrail = new UpdateTrail(trailRepository);

  // Cria a trilha
  const updateTrailResult = await updateTrail.execute(form.data)

  if (updateTrailResult.error) {
    return message(form, updateTrailResult.error.message);
  }

  // Retorna a trilha criada
  return {
    form
  };
}
