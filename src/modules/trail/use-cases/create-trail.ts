import { uuid } from '$lib/server/db/utils/uuid';
import { log } from '$lib/server/log';
import { Ok, type ResultType } from '$lib/types/result';
import type { ImageService } from '$modules/image/services';
import { TRAIL_PREVIEW_THUMBNAIL } from '../constants/trail-preview-thumbnail';
import type { CreateTrailDTO } from '../dtos/create-trail.dto';
import type { TrailPreview } from '../dtos/trail-preview.dto';
import type { TrailRepository } from '../repositories/trail.repository';

export class CreateTrail {
	constructor(
		private trailRepository: TrailRepository,
		private imageService: ImageService
	) {}

	async execute(data: CreateTrailDTO): Promise<ResultType<TrailPreview>> {
		const imageUploadResult = await this.imageService.uploadImage(data.thumbnail, {
			width: TRAIL_PREVIEW_THUMBNAIL.default.width,
			height: TRAIL_PREVIEW_THUMBNAIL.default.height
		});

		if (imageUploadResult.error) {
			return imageUploadResult;
		}

		const createdTrail = await this.trailRepository.create({
			id: uuid(),
			authorId: data.authorId,
			thumbnailDescription: data.thumbnailAlt,
			thumbnail: imageUploadResult.data,
			title: data.title,
			description: data.description
		});

		if (createdTrail.error) {
			log.error(createdTrail.error);
			return createdTrail;
		}

		const preview: TrailPreview = {
			...createdTrail.data,
			thumbnail: {
				url: createdTrail.data.thumbnail,
				alt: createdTrail.data.thumbnailDescription,
				height: TRAIL_PREVIEW_THUMBNAIL.default.height,
				width: TRAIL_PREVIEW_THUMBNAIL.default.width
			},
			updatedAt: createdTrail.data.updatedAt.toISOString(),
			slug: `/trails/${createdTrail.data.id}`
		};

		return Ok(preview);
	}
}
