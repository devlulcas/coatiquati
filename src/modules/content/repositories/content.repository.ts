import type { Content, ContentPreview, CreatableContent } from "../entities/content.entity";

export interface ContentRepositoryInterface {
	findById: (id: string) => Promise<Content>;
	findByCrumbId: (crumbId: string) => Promise<ContentPreview[]>;
	create: (content: CreatableContent) => Promise<Content>;
	update: (content: Content) => Promise<Content>;
	delete: (id: string) => Promise<void>;
}

