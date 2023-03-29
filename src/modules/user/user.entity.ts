export type User = {
	id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	createdAt: Date;
	updatedAt: Date;
};

export type CreatableUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export class UserEntity {
	private user: User;

	private constructor(user: User) {
		this.user = user;
	}

	public static create(user: CreatableUser, id?: string): UserEntity {
		const idToUse = id || crypto.randomUUID();
		return new UserEntity({ ...user, id: idToUse, createdAt: new Date(), updatedAt: new Date() });
	}
}
