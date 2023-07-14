import type { CrumbPreview } from '../dtos/crumbs.dto';
import type { Crumb } from '../entities/crumbs.entity';
export class CrumbMapper {
	public static toDTO(crumb: Crumb): CrumbPreview {
		return {
			id: crumb.id,
			title: crumb.title,
			description: crumb.description,
			contentTypeAvailable: crumb.contentTypeAvailable,
			trailId: crumb.trailId
		};
	}
}
