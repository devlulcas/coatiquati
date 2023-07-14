import { log } from '$lib/server/log';
import type { ResultType } from '$lib/types/result';
import type { ImageService } from '$modules/image/services';
import { TRAIL_PREVIEW_THUMBNAIL } from '../constants/trail-preview-thumbnail';
import type { UpdateTrailDTO } from '../dtos/update-trail.dto';
import type { TrailRepository } from '../repositories/trail.repository';
import type { Trail } from '../schemas/trail';

export class UpdateTrail {
	constructor(private trailRepository: TrailRepository, private imageService: ImageService) {}

	async execute(data: UpdateTrailDTO): Promise<ResultType<Trail>> {
		const trail = await this.trailRepository.findById(data.id);

		if (trail.error) return trail;

		// Nova imagem sobrescreve a antiga
		let thumbnail = trail.data.thumbnail;

		if (data.thumbnail instanceof File) {
			const imageUploadResult = await this.imageService.uploadImage(data.thumbnail, {
				width: TRAIL_PREVIEW_THUMBNAIL.default.width,
				height: TRAIL_PREVIEW_THUMBNAIL.default.height
			});

			if (imageUploadResult.error) return imageUploadResult;

			thumbnail = imageUploadResult.data;
		}

		// Apenas atualiza os campos que foram enviados
		const updatedTrail = await this.trailRepository.update({
			...trail.data,
			title: data.title,
			description: data.description,
			thumbnail: thumbnail,
			thumbnailDescription: data.thumbnailAlt
		});

		if (updatedTrail.error) {
			log.error(updatedTrail.error, `Error updating trail ${data.id}`);
		} else {
			log.info(updatedTrail.data, `Updated trail ${data.id}`);
		}

		return updatedTrail;
	}
}
