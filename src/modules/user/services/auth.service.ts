import type { JWTToken, Payload } from '../dtos/auth.dto';

export interface AuthServiceProviderInterface {
	generateToken(payload: Payload): Promise<JWTToken>;
	verifyToken(token: JWTToken): Promise<Payload>;
  verifyRefreshToken(token: JWTToken): Promise<Payload>;
  invalidateToken(token: JWTToken): Promise<void>;
}
