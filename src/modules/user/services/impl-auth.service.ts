import { JWT_KEY } from '$env/static/private';
import { importPKCS8, jwtVerify, SignJWT } from 'jose';
import type { JWTToken, Payload } from '../dtos/auth.dto';
import type { AuthServiceProviderInterface } from './auth.service';
import { nanoid } from 'nanoid';

export class ImplAuthServiceProvider implements AuthServiceProviderInterface {
	private alg = 'RS256';
	private pkcs8 = JWT_KEY;

	public async generateToken(payload: Payload): Promise<JWTToken> {
		const privateKey = await importPKCS8(this.pkcs8, this.alg);

		const jwt = await new SignJWT(payload)
			.setProtectedHeader({ alg: this.alg })
			.setIssuedAt()
			.setJti(nanoid())
			.setExpirationTime('2h')
			.sign(privateKey);

		return jwt;
	}

	public async verifyToken(token: JWTToken): Promise<Payload> {
		const key = await importPKCS8(this.pkcs8, this.alg);

		try {
			const verified = await jwtVerify(token, key);
			return verified.payload as Payload;
		} catch (error) {
			throw new Error('Expired or invalid token');
		}
	}

	public async generateRefreshToken(payload: Payload): Promise<JWTToken> {
    console.log('generateRefreshToken', payload);
		throw new Error('Method not implemented.');
	}

	public async verifyRefreshToken(token: JWTToken): Promise<Payload> {
		console.log('verifyRefreshToken', token);
		throw new Error('Method not implemented.');
	}

	public async clearUserAuthData(userId: string): Promise<void> {
		console.log('clearUserAuthData', userId);
		throw new Error('Method not implemented.');
	}
}
