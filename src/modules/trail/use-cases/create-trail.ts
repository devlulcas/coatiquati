import { uuid } from '$lib/server/db/utils/uuid';
import { log } from '$lib/server/log';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { ImageService } from '$modules/image/services';
import { TRAIL_PREVIEW_THUMBNAIL } from '../constants/trail-preview-thumbnail';
import { newTrailSchema } from '../dtos/new-trail.dto';
import type { TrailRepository } from '../repositories/trail.repository';
import type { Trail } from '../types/trail';

export class CreateTrail {
	constructor(
		private trailRepository: TrailRepository,
		private imageService: ImageService
	) {}

	async execute(data: unknown): Promise<ResultType<Trail>> {
		const parsedResult = newTrailSchema.safeParse(data);

		if (!parsedResult.success) {
			return Fail({
				message: 'Dados inválidos',
				type: 'badRequest',
				fieldErrors: parsedResult.error.flatten().fieldErrors
			});
		}

		const imageUploadResult = await this.imageService.uploadImage(parsedResult.data.thumbnail, {
			width: TRAIL_PREVIEW_THUMBNAIL.default.width,
			height: TRAIL_PREVIEW_THUMBNAIL.default.height
		});

		if (imageUploadResult.error) {
			log.error(imageUploadResult.error);

			return Fail({
				message: 'Erro ao fazer upload da imagem',
				type: 'badRequest',
				fieldErrors: {
					thumbnail: [imageUploadResult.error.message]
				}
			});
		}

		const createdTrail = await this.trailRepository.create({
			id: uuid(),
			authorId: parsedResult.data.authorId,
			thumbnailDescription: parsedResult.data.thumbnailAlt,
			thumbnail: imageUploadResult.data,
			title: parsedResult.data.title,
			description: parsedResult.data.description
		});

		if (createdTrail.error) {
			log.error(createdTrail.error);

			return Fail({
				message: 'Erro ao criar a trilha',
				type: 'internalServerError'
			});
		}

		const preview: Trail = {
			...createdTrail.data,
			contributors: []
		};

		return Ok(preview);
	}
}
