import { uuid } from '$lib/server/db/utils/uuid';
import { log } from '$lib/server/log';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { slugify } from '$lib/utils/slugify';
import type { ImageService } from '$modules/image/services';
import { TRAIL_PREVIEW_THUMBNAIL } from '../constants/trail-preview-thumbnail';
import type { NewTrailSchema } from '../dtos/new-trail.dto';
import type { TrailRepository } from '../repositories/trail.repository';
import type { Trail } from '../types/trail';

export class CreateTrail {
	constructor(
		private trailRepository: TrailRepository,
		private imageService: ImageService
	) {}

	async execute(data: NewTrailSchema): Promise<ResultType<Trail>> {
		const imageUploadResult = await this.imageService.uploadImage(data.thumbnail, {
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

		const id = uuid();

		const slug = slugify(data.title) + '-' + id;

		const createdTrail = await this.trailRepository.create({
			id: id,
			slug: slug,
			authorId: data.authorId,
			thumbnailDescription: data.thumbnailAlt,
			thumbnail: imageUploadResult.data,
			title: data.title,
			description: data.description
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
