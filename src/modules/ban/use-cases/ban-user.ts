import { uuid } from '$lib/server/db/utils/uuid';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { BanRegistryRepository } from '$modules/ban/repositories/ban-registry.repository';
import { isAdministrator } from '$modules/user/constants/user-roles';
import type { UserRepository } from '$modules/user/repositories/user.repository';
import type { BanSchema } from '../dtos/ban.dto';
import type { NewBanRegistryTable } from '../schemas/ban-registry';

export class BanUser {
	constructor(
		private userRepository: UserRepository,
		private banRegistryRepository: BanRegistryRepository
	) {}

	async execute(data: Omit<NewBanRegistryTable, 'id'>): Promise<ResultType<BanSchema>> {
		const admin = await this.userRepository.findById(data.adminId);

		if (admin.error) {
			return admin;
		}

		if (!isAdministrator(admin.data.roles)) {
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
