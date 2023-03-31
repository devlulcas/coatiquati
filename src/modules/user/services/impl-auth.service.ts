import type { JWTToken, Payload } from '../dtos/auth.dto';
import { decodeJWT, encodeJWT } from '../infra/jwt';
import { RedisClient } from '../infra/redis-client';
import type { AuthServiceProviderInterface } from './auth.service';

function isPayload(data: unknown): data is Payload {
	if (typeof data !== 'object') return false;
	if (data === null) return false;
	if ('id' in data) return true;
	return false;
}

export class ImplAuthServiceProvider implements AuthServiceProviderInterface {
	private redisClient: RedisClient;

	constructor() {
		this.redisClient = new RedisClient();
	}

	public async generateToken(payload: Payload): Promise<JWTToken> {
		return encodeJWT(payload, '5m');
	}

	public async verifyToken(token: JWTToken): Promise<Payload> {
		const payload = await decodeJWT(token);

		if (!isPayload(payload)) {
			throw new Error('Invalid token');
		}

		return payload;
	}

	public async generateRefreshToken(payload: Payload): Promise<JWTToken> {
		return encodeJWT(payload, '1y');
	}

	public async verifyRefreshToken(token: JWTToken): Promise<Payload> {
		const payload = await decodeJWT(token);

		if (!isPayload(payload)) {
			throw new Error('Invalid token');
		}

		return payload;
	}

	public async refreshToken(refreshToken: JWTToken, token: JWTToken): Promise<JWTToken> {
		const payload = await this.verifyToken(token);

		const refreshTokenPayload = await this.verifyRefreshToken(refreshToken);
    
		return encodeJWT(payload, '5m');
	}

	public async invalidateToken(token: JWTToken): Promise<void> {
		console.log('invalidateToken', token);
		// TODO
	}
}
