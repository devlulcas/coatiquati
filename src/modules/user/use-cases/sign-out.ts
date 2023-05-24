import type { AuthService } from '../services/auth.service';

export class SignOut {
	constructor(private authService: AuthService) {}

	async execute(sessionId: string): Promise<void> {
		await this.authService.signOut(sessionId);
	}
}
