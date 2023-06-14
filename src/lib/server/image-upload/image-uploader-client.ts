import type { ResultType } from '$lib/types/result';

export type ImageUploaderClient = {
	uploadImage(image: File): Promise<ResultType<string>>;
};
