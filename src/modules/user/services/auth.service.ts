import type { ResultType } from '$lib/types/result';
import type { Session } from 'lucia-auth';
import type { SignInWithUsernameDTO } from '../dtos/sign-in-with-username.dto';
import type { SignUpWithUsernameDTO } from '../dtos/sign-up-with-username.dto';

export interface AuthService {
	signInWithGithub(code: string): Promise<ResultType<Session>>;
	signInWithGoogle(code: string): Promise<ResultType<Session>>;
	signInWithUsername(data: SignInWithUsernameDTO): Promise<ResultType<Session>>;
	signUpWithUsername(data: SignUpWithUsernameDTO): Promise<ResultType<Session>>;
	signOut(sessionId: string): Promise<ResultType<null>>;
}
