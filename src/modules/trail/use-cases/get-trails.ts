import { log } from '$lib/server/log';
import { Ok, type ResultType } from '$lib/types/result';
import { TRAIL_PREVIEW_THUMBNAIL } from '../constants/trail-preview-thumbnail';
import type { GetTrailsDTO } from '../dtos/get-trails.dto';
import type { TrailPreview } from '../dtos/trail-preview.dto';
import type { TrailRepository } from '../repositories/trail.repository';

export class GetTrails {
	constructor(private trailRepository: TrailRepository) {}

	async execute(data: GetTrailsDTO = {}): Promise<ResultType<TrailPreview[]>> {
		const trailPreviewsResult = await this.trailRepository.findMany(data);

		if (trailPreviewsResult.error) {
			log.error(trailPreviewsResult.error, `Error getting trails`);
			return trailPreviewsResult;
		}

		const previews: TrailPreview[] = trailPreviewsResult.data.map((trail) => ({
			...trail,
			thumbnail: {
				url: trail.thumbnail,
				alt: trail.thumbnailDescription,
				height: TRAIL_PREVIEW_THUMBNAIL.default.height,
				width: TRAIL_PREVIEW_THUMBNAIL.default.width
			},
			updatedAt: trail.updatedAt.toISOString(),
			slug: `/trails/${trail.id}`
		}));

		return Ok(previews);
	}
}
