import type { User } from '../entities/user.entity';

export type UserWithoutPasswordDTO = Omit<User, 'password'>;
