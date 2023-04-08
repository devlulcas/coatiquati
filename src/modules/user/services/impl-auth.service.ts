import type { JWTToken, Payload } from '../dtos/auth.dto';
import { decodeJWT, encodeJWT } from '../infra/jwt';
import type { AuthServiceProviderInterface } from './auth.service';

function isPayload(data: unknown): data is Payload {
	if (typeof data !== 'object') return false;
	if (data === null) return false;
	if ('id' in data) return true;
	return false;
}

export class ImplAuthServiceProvider implements AuthServiceProviderInterface {
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
}
