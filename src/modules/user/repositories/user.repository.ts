import type { CreatableUser, UpdatableUser, User } from '../entities/user.entity';

export interface UserRepositoryInterface {
	findByEmail(email: string): Promise<User>;
	create(user: CreatableUser): Promise<User>;
	update(user: UpdatableUser): Promise<User>;
	delete(userId: string): Promise<User>;
	findById(id: string): Promise<User>;
	findAll(): Promise<User[]>;
}
