import type { Crumb, CrumbPreview } from "../entities/crumbs.entity";

export class CrumbMapper {
  public static toDTO(crumb: Crumb): CrumbPreview {
    return {
      id: crumb.id,
      title: crumb.title,
      description: crumb.description,
      contentTypeAvailable: crumb.contentTypeAvailable,
      trailId : crumb.trailId,
    };
  }
}