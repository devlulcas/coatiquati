import { JWT_KEY } from '$env/static/private';
import { importPKCS8, jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { nanoid } from 'nanoid';
import type { JWTToken, Payload } from '../dtos/auth.dto';

const alg = 'RS256';

export async function encodeJWT(payload: Payload, duration: string): Promise<string> {
	const privateKey = await importPKCS8(JWT_KEY, alg);

	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setJti(nanoid())
		.setExpirationTime(duration)
		.sign(privateKey);

	return jwt;
}

export async function decodeJWT(token: JWTToken): Promise<JWTPayload> {
  const key = await importPKCS8(JWT_KEY, alg);

  try {
    const verified = await jwtVerify(token, key);
    return verified.payload;
  } catch (error) {
    throw new Error('Expired or invalid token');
  }
}

