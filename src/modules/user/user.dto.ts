import type { User } from "$src/entities/user.entity";

export type UserWithoutPasswordDTO = Omit<User, 'password'>;
