import { uuid } from '$lib/server/db/utils/uuid';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { BanDTO } from '$modules/ban/dtos/ban.dto';
import type { BanRegistryRepository } from '$modules/ban/repositories/ban-registry.repository';
import type { NewBanRegistry } from '$modules/ban/schemas/ban-registry';
import { Roles, userRolesHasRole } from '$modules/user/constants/user-roles';
import type { UserRepository } from '$modules/user/repositories/user.repository';

export class BanUser {
	constructor(private userRepository: UserRepository, private banRegistryRepository: BanRegistryRepository) {}

	async execute(data: NewBanRegistry): Promise<ResultType<BanDTO>> {
		const admin = await this.userRepository.findById(data.adminId);

		if (admin.error) {
			return admin;
		}

		if (!userRolesHasRole(Roles.ADMIN, admin.data.roles)) {
			return Fail('Você não tem permissão para banir usuários');
		}

		const banRegistry = await this.banRegistryRepository.create({
			id: uuid(),
			adminId: data.adminId,
			reason: data.reason,
			userId: data.userId
		});

		if (banRegistry.error) {
			return banRegistry;
		}

		const target = await this.userRepository.update(data.userId, {
			banVotes: 1
		});

		if (target.error) {
			return target;
		}

		return Ok({
			reason: banRegistry.data.reason,
			target: target.data,
			first: admin.data,
			second: null,
			registry: banRegistry.data
		});
	}
}
