import type { UpdateUserDataDTO, UserWithoutPasswordDTO } from '../dtos/user.dto';
import type { User } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import type { UserRepositoryInterface } from '../repositories/user.repository';

export class UpdateUserData {
	constructor(private userRepository: UserRepositoryInterface) {}

	async execute(data: UpdateUserDataDTO): Promise<UserWithoutPasswordDTO> {
		if (!data.id) {
			throw new Error('User id not provided');
		}

		const user = await this.userRepository.findById(data.id);

		if (!user) {
			throw new Error('User not found');
		}

		const updatedUser = await this.userRepository.update({
			...user,
			firstName: data.firstName,
			lastName: data.lastName
		});

		return UserMapper.toDTO(updatedUser);
	}
}
