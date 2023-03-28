export type TextContent = 'rich_text' | 'markdown' | 'html';

export type ContentType = TextContent | 'image' | 'video' | 'link';

export type Content = {
	id: string;
	title: string;
	body: string;
	type: ContentType;
	crumbId: string;
};

export type ContentPreview = Omit<Content, 'body'>;

export type CreatableContent = Omit<Content, 'id'>;

export interface ContentRepositoryInterface {
	get: (id: string) => Promise<Content>;
	getByCrumbId: (crumbId: string) => Promise<ContentPreview[]>;
	create: (content: CreatableContent) => Promise<Content>;
	update: (content: Content) => Promise<Content>;
	delete: (id: string) => Promise<void>;
}

export class MockContentRepository implements ContentRepositoryInterface {
	private contents: Content[] = [];

	async get(id: string): Promise<Content> {
		const content = this.contents.find((content) => content.id === id);
		if (!content) {
			throw new Error('Content not found');
		}
		return content;
	}

	async getByCrumbId(crumbId: string): Promise<ContentPreview[]> {
		const filteredContent = this.contents.filter((content) => content.crumbId === crumbId);

		return filteredContent.map((content) => {
			return {
				id: content.id,
				title: content.title,
				type: content.type,
				crumbId: content.crumbId
			};
		});
	}

	async create(content: CreatableContent): Promise<Content> {
		const newContent = {
			id: Math.random().toString(36),
			...content
		};

		this.contents.push(newContent);

		return newContent;
	}

	async update(content: Content): Promise<Content> {
		const index = this.contents.findIndex((c) => c.id === content.id);
		if (index === -1) {
			throw new Error('Content not found');
		}
		this.contents[index] = content;
		return content;
	}

	async delete(id: string): Promise<void> {
		const index = this.contents.findIndex((c) => c.id === id);
		if (index === -1) {
			throw new Error('Content not found');
		}
		this.contents.splice(index, 1);
	}
}
