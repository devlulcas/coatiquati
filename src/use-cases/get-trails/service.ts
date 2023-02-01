import type { Trail } from '$src/types/trails';
import { createTrailPreview } from '../fake-data';

export class GetTrailsService {
	async execute() {
		const trails: Trail[] = Array.from({ length: 20 }, (_, i) => createTrailPreview(i + 1));

		return {
			trails
		};
	}
}
