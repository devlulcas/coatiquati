import type { TrailPreview } from "../dtos/trail.dto";
import type { Trail } from "../entities/trail.entity";

export class TrailMapper {
  static toDTO(trail: Trail): TrailPreview {
    return {
      id: trail.id,
      author: trail.author,
      crumbCount: trail.crumbCount,
      description: trail.description,
      picture: trail.picture,
      title: trail.title,
      slug: trail.slug
    };
  }

  static toDTOList(trails: Trail[]): TrailPreview[] {
    return trails.map(TrailMapper.toDTO);
  }
}
