import type { User } from "$src/entities/user.entity";
import type { UserWithoutPasswordDTO } from "./user.dto";

export class UserMapper {
  /**
   * Maps a UserEntity to a UserPreviewDTO
   * Omits the password property
   */
  static toDTO(user: User): UserWithoutPasswordDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}