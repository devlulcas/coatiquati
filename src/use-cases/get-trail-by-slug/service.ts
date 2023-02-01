import type { Breadcrumb } from '$src/types/breadcrumbs';
import type { Trail } from '$src/types/trails';
import { createBreadcrumbPreview, createTrailPreview } from '../fake-data';

export class GetTrailBySlugService {
	async execute(slug: string) {
		console.log(slug);

		const trail: Trail = createTrailPreview(1);

		const breadcrumbs: Breadcrumb[] = Array.from({ length: 20 }, (_, i) =>
			createBreadcrumbPreview(i + 1)
		);

		return {
			trail,
			breadcrumbs
		};
	}
}
