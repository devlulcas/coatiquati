import type { Content, ContentPreview, CreatableContent } from "../entities/content.entity";
import type { ContentRepositoryInterface } from "./content.repository";

export class MockContentRepository implements ContentRepositoryInterface {
	private contents: Content[] = [];

	async findById(id: string): Promise<Content> {
		const content = this.contents.find((content) => content.id === id);
		
    if (!content) {
			throw new Error('Content not found');
		}

		return content;
	}

	async findByCrumbId(crumbId: string): Promise<ContentPreview[]> {
		const filteredContent = this.contents.filter((content) => content.crumbId === crumbId);

		return filteredContent.map((content) => ({
      id: content.id,
      title: content.title,
      type: content.type,
      crumbId: content.crumbId
    }));
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
