import { z } from 'zod';

export class UserEmail {
	private value: string;

	private constructor(email: string) {
		this.value = email;
	}

	get email(): string {
		return this.value;
	}

	/**
	 * Creates a new UserEmail instance
	 * If the email is not valid, it will throw an error
	 *
	 * @param email The e-mail to be validated
	 * @returns A new UserEmail instance
	 * @throws {z.ZodError} If the e-mail is not valid
	 * @example
	 *
	 * console.log('New user e-mail');
	 * const userEmail = await UserEmail.create('test@test.com');
	 */
	public static create(email: string): UserEmail {
		const parsedEmail = z.string().email().parse(email);
		const userEmail = new UserEmail(parsedEmail);
		return userEmail;
	}
}
