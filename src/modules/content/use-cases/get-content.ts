import type { ContentWithoutUnprocessedBody } from "../dtos/content.dto";
import type { ContentRepositoryInterface } from "../repositories/content.repository";

export class GetContent {
  constructor(private contentRepository: ContentRepositoryInterface) {}

  public async execute(id: string): Promise<ContentWithoutUnprocessedBody> {
    return this.contentRepository.findById(id);
  }
}
