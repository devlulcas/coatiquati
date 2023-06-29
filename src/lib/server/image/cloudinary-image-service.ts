import {
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_CLOUD_NAME
} from '$env/static/private';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import cloudinary from 'cloudinary';
import { nanoid } from 'nanoid';
import { log } from '../log';
import type { ImageProperties, ImageService } from './image-service';
export type { ImageService } from './image-service';

type Cloudinary = typeof cloudinary.v2;

export class CloudinaryImageService implements ImageService {
	private readonly cloudinary: Cloudinary;

	constructor() {
		this.cloudinary = cloudinary.v2;
		this.cloudinary.config({
			cloud_name: CLOUDINARY_CLOUD_NAME,
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_API_SECRET
		});
	}

	async uploadImage(image: File, properties: ImageProperties): Promise<ResultType<string>> {
		const uri = await this.toURI(image).catch((error) => {
			log.error(error);
			return null;
		});

		if (!uri) {
			return Fail('Error ao converter a imagem para uri');
		}

		const result = await this.cloudinary.uploader
			.upload(uri, {
				public_id: this.generatePublicId(),
				overwrite: true,
				width: properties.width,
				height: properties.height,
				folder: 'coatiquati',
				transformation: [{ width: properties.width, height: properties.height, crop: 'fill' }]
			})
			.catch((error) => {
				log.error(error);
				return null;
			});

		if (!result) {
			return Fail('Erro ao fazer upload da imagem');
		}

		return Ok(result.secure_url);
	}

	private async toURI(file: File): Promise<string> {
		const type = file.type;
		const data = Buffer.from(await file.arrayBuffer());
		return 'data:' + type + ';base64,' + data.toString('base64');
	}

	private generatePublicId(): string {
		return 'coatiquati_' + nanoid();
	}
}
