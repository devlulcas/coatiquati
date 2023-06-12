import type { ResultType } from '$lib/types/result';

export interface ImageUploaderClient {
	uploadImage(image: File): Promise<ResultType<string>>;
}
