import { log } from '$lib/server/log';
import type { ResultType } from '$lib/types/result';
import { slugify } from '$lib/utils/slugify';
import type { ImageService } from '$modules/image/services';
import type { CreateTrailDTO } from '../dtos/create-trail.dto';
import type { TrailPreview } from '../dtos/trail-preview.dto';
import type { TrailRepository } from '../repositories/trail.repository';

export class CreateTrail {
	constructor(
		private trailRepository: TrailRepository,
		private imageUploaderClient: ImageService
	) {}

	async execute(data: CreateTrailDTO): Promise<ResultType<TrailPreview>> {
		const slug = slugify(data.title);

		const imageUploadResult = await this.imageUploaderClient.uploadImage(data.image, {
			width: 600,
			height: 600
		});

		if (imageUploadResult.error) {
			return imageUploadResult;
		}

		const createdTrail = await this.trailRepository.create({
			authorId: data.authorId,
			imageAlt: data.imageAlt,
			image: imageUploadResult.data,
			title: data.title,
			description: data.description,
			slug
		});

		if (createdTrail.error) {
			log.error(createdTrail.error);
		}

		return createdTrail;
	}
}
