import type { User } from '../entities/user.entity';

export type UserWithoutPasswordDTO = Omit<User, 'password'>;

export type UpdateUserPasswordDTO = {
	id: User['id'];
	password: User['password'];
	oldPassword: User['password'];
};

export type UpdateUserDataDTO = Pick<User, 'firstName' | 'lastName' | 'id'>;
