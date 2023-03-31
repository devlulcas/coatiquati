import type { JWTToken, Payload } from '../dtos/auth.dto';

export interface AuthServiceProviderInterface {
	generateToken(payload: Payload): Promise<JWTToken>;
	verifyToken(token: JWTToken): Promise<Payload>;
	generateRefreshToken(payload: Payload): Promise<JWTToken>;
	verifyRefreshToken(token: JWTToken): Promise<Payload>;
	clearUserAuthData(userId: string): Promise<void>;
}
