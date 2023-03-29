import type { CreatableUser, UpdatableUser, User } from '../entities/user.entity';
import type { UserRepositoryInterface } from './user.repository';

export class MockUserRepository implements UserRepositoryInterface {
	private users: User[] = [];

	async findByEmail(email: string): Promise<User> {
		const user = this.users.find((user) => user.email === email);

		if (!user) {
			throw new Error('User not found');
		}

		return user;
	}

	async create(user: CreatableUser): Promise<User> {
		const newUser = {
			id: Math.random().toString(36),
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		this.users.push(newUser);

		return newUser;
	}

	async update(user: UpdatableUser): Promise<User> {
		if (user.id === undefined) {
			throw new Error('User id is required');
		}

		const userToUpdate = await this.findById(user.id);

		const updatedUser = {
			...userToUpdate,
			...user,
			updatedAt: new Date()
		};

		this.users = this.users.map((user) => {
			if (user.id === userToUpdate.id) {
				return updatedUser;
			}

			return user;
		});

		return updatedUser;
	}

	async delete(userId: string): Promise<User> {
		const userToDelete = await this.findById(userId);

		this.users = this.users.filter((user) => user.id !== userId);

		return userToDelete;
	}

	async findById(id: string): Promise<User> {
		const user = this.users.find((user) => user.id === id);

		if (!user) {
			throw new Error('User not found');
		}

		return user;
	}

	async findAll(): Promise<User[]> {
		return this.users;
	}
}
