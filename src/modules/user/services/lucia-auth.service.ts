import { auth, googleAuth } from '$lib/server/auth';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { Prisma } from '@prisma/client';
import { LuciaError, type Session } from 'lucia-auth';
import { AuthProviders } from '../constants/auth-providers';
import { Roles } from '../constants/user-roles';
import type { SignInWithUsernameDTO } from '../dtos/sign-in-with-username.dto';
import type { SignUpWithUsernameDTO } from '../dtos/sign-up-with-username.dto';
import type { AuthService } from './auth.service';

export class LuciaAuthService implements AuthService {
	/**
	 * Cria uma sessão para o usuário usando o código do Github.
	 */
	async signInWithGithub(code: string): Promise<ResultType<Session>> {
		throw new Error('Method not implemented.' + code);
	}

	/**
	 * Cria uma sessão para o usuário usando o código do Google.
	 */
	async signInWithGoogle(code: string): Promise<ResultType<Session>> {
		try {
			const { existingUser, providerUser, createUser } = await googleAuth.validateCallback(code);

			const getUser = async () => {
				if (existingUser) return existingUser;

				// O Google não fornece um endereço de e-mail, então vamos fingir que é isso mesmo
				return createUser({
					username: providerUser.name,
					roles: [Roles.USER],
					email: providerUser.email || providerUser.sub + '@google.com',
					name: providerUser.name
				});
			};

			const user = await getUser();

			const session = await auth.createSession(user.id);

			return Ok(session);
		} catch (error) {
			console.log(error);
			return Fail('Erro ao entrar.');
		}
	}

	/**
	 * Inválida a sessão atual do usuário.
	 */
	async signOut(sessionId: string): Promise<ResultType<null>> {
		try {
			await auth.invalidateSession(sessionId);

			return Ok(null);
		} catch (error) {
			return Fail('Erro ao sair.');
		}
	}

	/**
	 * Cria uma sessão para o usuário usando usuário e senha.
	 */
	async signInWithUsername(data: SignInWithUsernameDTO): Promise<ResultType<Session>> {
		try {
			const key = await auth.useKey('username', data.username, data.password);

			const session = await auth.createSession(key.userId);

			return Ok(session);
		} catch (error) {
			if (
				error instanceof LuciaError &&
				(error.message === 'AUTH_INVALID_KEY_ID' || error.message === 'AUTH_INVALID_PASSWORD')
			) {
				return Fail('Usuário ou senha incorretos.');
			}

			return Fail('Erro desconhecido.');
		}
	}

	/**
	 * Criar um usuário usando usuário e senha. Pede e-mail para enviar e-mails de segurança.
	 */
	async signUpWithUsername(data: SignUpWithUsernameDTO): Promise<ResultType<Session>> {
		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: AuthProviders.USERNAME,
					providerUserId: data.username,
					password: data.password
				},
				attributes: {
					username: data.username,
					roles: [Roles.USER],
					email: data.email,
					name: data.name ? data.name : undefined
				}
			});

			const session = await auth.createSession(user.id);

			return Ok(session);
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002' &&
				error.message?.includes('username')
			) {
				return Fail('Nome de usuário já cadastrado.');
			}

			if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
				return Fail('Nome de usuário já cadastrado.');
			}

			return Fail('Erro ao cadastrar usuário.');
		}
	}
}
