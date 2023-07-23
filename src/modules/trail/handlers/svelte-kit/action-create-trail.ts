import type { TrailAction } from "$/routes/admin/trails/+page.server";
import { adminBarrier } from '$lib/server/auth/utils/barriers';
import { protect } from '$lib/server/auth/utils/protect';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { CloudinaryImageService } from '$modules/image/services';
import { newTrailSchema } from '$modules/trail/dtos/new-trail.dto';
import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { CreateTrail } from '$modules/trail/use-cases/create-trail';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

/**
 * Cria uma trilha a partir de um formulário enviado pelo cliente
 */
export const createTrailAction: TrailAction = async ({ request, locals, url }) => {
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

  // Adiciona o id do usuário ao formulário
  formData.append('authorId', validatedUserSession.user.id);

  const form = await superValidate(formData, newTrailSchema.omit({ thumbnail: true }));

  if (!form.valid) {
    return fail(400, {
      form
    });
  }

  // Valida a imagem
  const imageResult = newTrailSchema.pick({ thumbnail: true }).safeParse(formData.get('thumbnail'));

  if (imageResult.success === false) {
    return message(form, imageResult.error.message);
  }

  // Instancia os serviços e o caso de uso
  const trailRepository = new PostgresTrailRepository();
  const imageService = new CloudinaryImageService();
  const createTrail = new CreateTrail(trailRepository, imageService);

  // Cria a trilha
  const createTrailResult = await createTrail.execute({
    ...form.data,
    ...imageResult.data
  });

  if (createTrailResult.error) {
    return message(form, createTrailResult.error.message);
  }

  // Retorna a trilha criada
  return {
    form
  };
}
