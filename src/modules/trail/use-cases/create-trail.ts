import type { ResultType } from '$lib/types/result';
import { slugify } from '$lib/utils/slugify';
import type { ImageUploaderClient } from '$src/modules/image-upload/infra/image-uploader-client';
import type { CreateTrailDTO } from '../dtos/create-trail.dto';
import type { TrailPreview } from '../dtos/trail-preview.dto';
import type { TrailRepository } from '../repositories/trail.repository';

export class CreateTrail {
	constructor(
		private trailRepository: TrailRepository,
		private imageUploaderClient: ImageUploaderClient
	) {}

	async execute(data: CreateTrailDTO): Promise<ResultType<TrailPreview>> {
		const slug = slugify(data.title);

		const imageUploadResult = await this.imageUploaderClient.uploadImage(data.image);

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

		return createdTrail;
	}
}
