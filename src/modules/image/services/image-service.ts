import type { ResultType } from '$lib/types/result';

export type ImageProperties = {
	width: number;
	height: number;
};

export type ImageService = {
	uploadImage(image: File, properties: ImageProperties): Promise<ResultType<string>>;
};
