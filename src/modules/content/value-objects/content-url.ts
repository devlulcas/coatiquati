import { z } from 'zod';
import type { UrlContentType } from '../entities/content.entity';

const typeByExtension: Record<UrlContentType, string[]> = {
	video: ['mp4', 'webm', 'ogg'],
	image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'avif', 'bmp', 'ico'],
	audio: ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'wma', 'opus'],
	document: ['pdf']
};

export class ContentUrl {
	private value: {
		url: URL;
		type: UrlContentType;
	};

	private constructor(url: URL, type: UrlContentType) {
		this.value = {
			url,
			type
		};
	}

	get url(): string {
		return this.value.url.toString();
	}

	get type(): UrlContentType {
		return this.value.type;
	}

	private static determinateType(url: URL): UrlContentType {
		if (url.hostname === 'www.youtube.com') {
			return 'video';
		}

		const extension = url.pathname.split('.').pop();

		if (!extension) {
			throw new Error('Invalid URL');
		}

		for (const [type, extensions] of Object.entries(typeByExtension)) {
			if (extensions.includes(extension)) {
				// Confia
				return type as UrlContentType;
			}
		}

		throw new Error('Invalid URL');
	}

	/**
	 * Creates a new ContentUrl instance
	 * If the content URL is not valid, it will throw an error
	 * If the URL is a video, from outside YouTube, it will throw an error
	 *
	 * @param url The URL to be validated
	 * @returns A new ContentUrl instance
	 * @throws {z.ZodError} If the URL is not valid
	 * @example
	 *
	 * console.log('New URL content');
	 * const contentURL = await ContentUrl.create('https://www.youtube.com/watch?v=12345');
	 */
	public static create(stringUrl: string): ContentUrl {
		const parsedUrl = z.string().url().parse(stringUrl);

		const url = new URL(parsedUrl);

		const type = ContentUrl.determinateType(url);

		const contentUrl = new ContentUrl(url, type);

		return contentUrl;
	}
}
