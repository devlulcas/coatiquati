import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { BanDTO } from '$src/modules/ban/dtos/ban.dto';
import type { BanRegistryRepository } from '$src/modules/ban/repositories/ban-registry.repository';
import { Roles, userRolesHasRole } from '$src/modules/user/constants/user-roles';
import type { UserRepository } from '$src/modules/user/repositories/user.repository';

type ConfirmBanUserDTO = {
	banRegistryId: number;
	secondAdminId: string;
};

export class ConfirmBanUser {
	constructor(
		private userRepository: UserRepository,
		private banRegistryRepository: BanRegistryRepository
	) {}

	async execute(data: ConfirmBanUserDTO): Promise<ResultType<BanDTO>> {
		const banRegistry = await this.banRegistryRepository.findById(data.banRegistryId);

		if (banRegistry.error) {
			return banRegistry;
		}

		const [firstAdmin, secondAdmin, target] = await Promise.all([
			this.userRepository.findById(banRegistry.data.adminId),
			this.userRepository.findById(data.secondAdminId),
			this.userRepository.findById(banRegistry.data.userId)
		]);

		if (firstAdmin.error || secondAdmin.error || target.error) {
			return Fail('Não foi possível encontrar os usuários');
		}

		if (!userRolesHasRole(Roles.ADMIN, secondAdmin.data.roles)) {
			return Fail('Você não tem permissão para banir usuários');
		}

		const updatedBanRegistry = await this.banRegistryRepository.update(data.banRegistryId, {
			secondAdminId: secondAdmin.data.id
		});

		if (updatedBanRegistry.error) {
			return updatedBanRegistry;
		}

		const bannedUser = await this.userRepository.update(banRegistry.data.userId, {
			active: false,
			banVotes: 2
		});

		if (bannedUser.error) {
			return bannedUser;
		}

		return Ok({
			reason: banRegistry.data.reason,
			target: target.data,
			first: firstAdmin.data,
			second: secondAdmin.data,
			registry: banRegistry.data
		});
	}
}
