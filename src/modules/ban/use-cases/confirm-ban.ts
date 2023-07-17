import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { BanDTO } from '$modules/ban/dtos/ban.dto';
import type { BanRegistryRepository } from '$modules/ban/repositories/ban-registry.repository';
import { isAdministrator } from '$modules/user/constants/user-roles';
import type { UserRepository } from '$modules/user/repositories/user.repository';
import type { AuthUserId } from '$modules/user/schemas/auth-user';
import type { BanRegistryId } from '../schemas/ban-registry';

type ConfirmBanUserDTO = {
	banRegistryId: BanRegistryId;
	secondAdminId: AuthUserId;
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

		if (!isAdministrator(secondAdmin.data.roles)) {
			return Fail('Você não tem permissão para banir usuários');
		}

		const updatedBanRegistry = await this.banRegistryRepository.update({
			id: data.banRegistryId,
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
