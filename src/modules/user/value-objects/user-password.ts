import bcrypt from 'bcryptjs';
import { z } from 'zod';

export class UserPassword {
	private value: string;
	private isHashed: boolean;

	private constructor(password: string, isHashed: boolean) {
		this.value = password;
		this.isHashed = isHashed;
	}

	/**
	 * Hashes this password
	 */
	public async hash(): Promise<UserPassword> {
		if (this.isHashed) return this;

		const hashedPassword = await bcrypt.hash(this.value, 10);

		this.value = hashedPassword;

		this.isHashed = true;

		return this;
	}

	/**
	 * Compares a plain text password with this password
	 */
	public async compare(plainTextPassword: string): Promise<boolean> {
		if (!this.isHashed) return false;

		return bcrypt.compare(plainTextPassword, this.value);
	}

	/**
	 * Creates a new UserPassword instance
	 * If the password is not hashed, it will be hashed
	 *
	 * @param password The password to be hashed
	 * @param isHashed Whether the password is already hashed
	 * @returns A new UserPassword instance
	 * @throws {z.ZodError} If the password is not valid
	 * @example
	 *
	 * console.log('New user password');
	 * const userPassword = await UserPassword.create('password123');
	 * const hashedPassword = await userPassword.hash();
	 * const isPasswordValid = await hashedPassword.compare('password123');
	 *
	 * console.log('Existing user password');
	 * const hashedPassword = await UserPassword.create('$123abcd', true);
	 * const isPasswordValid = await hashedPassword.compare('password123');
	 */
	public static create(password: string, isHashed = false): Promise<UserPassword> {
		const parsedPassword = z.string().nonempty().min(8).max(255).parse(password);
		const userPassword = new UserPassword(parsedPassword, isHashed);
		return userPassword.hash();
	}
}
