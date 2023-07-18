import type { ResultType } from '$lib/types/result';
import type { Session } from 'lucia-auth';
import type { SignInWithUsernameSchema } from '../dtos/sign-in-with-username.dto';
import type { SignUpWithUsernameSchema } from '../dtos/sign-up-with-username.dto';

export interface AuthService {
	signInWithGithub(code: string): Promise<ResultType<Session>>;
	signInWithGoogle(code: string): Promise<ResultType<Session>>;
	signInWithUsername(data: SignInWithUsernameSchema): Promise<ResultType<Session>>;
	signUpWithUsername(data: SignUpWithUsernameSchema): Promise<ResultType<Session>>;
	signOut(sessionId: string): Promise<ResultType<null>>;
}
