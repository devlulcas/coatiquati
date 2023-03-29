import type { UserWithoutPasswordDTO } from '../dtos/user.dto';
import type { User } from '../entities/user.entity';

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
			updatedAt: user.updatedAt
		};
	}

	/**
	 * Maps an array of UserEntity to an array of UserPreviewDTO
	 * Omits the password property
	 */
	static toDTOList(users: User[]): UserWithoutPasswordDTO[] {
		return users.map((user) => this.toDTO(user));
	}
}
