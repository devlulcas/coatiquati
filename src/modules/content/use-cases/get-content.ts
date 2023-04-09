import type { ContentWithoutUnprocessedBody } from "../entities/content.entity";
import type { ContentRepositoryInterface } from "../repositories/content.repository";

export class GetContent {
  constructor(private contentRepository: ContentRepositoryInterface) {}

  public async execute(id: string): Promise<ContentWithoutUnprocessedBody> {
    return this.contentRepository.findById(id);
  }
}