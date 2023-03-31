import { SignJWT } from "jose";
import type { JWTToken, Payload } from "../dtos/auth.dto";
import type { AuthServiceProviderInterface } from "./auth.service";
import { nanoid } from "nanoid";

export class ImplAuthServiceProvider implements AuthServiceProviderInterface  {
  public async generateToken(payload: Payload): Promise<JWTToken> {
    if (!payload) {
      throw new Error("Payload is required");
    }
  
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign();
  



		console.log('generateToken', payload);
		throw new Error('Method not implemented.');
	}

	public async verifyToken(token: JWTToken): Promise<Payload> {
		console.log('verifyToken', token);
		throw new Error('Method not implemented.');
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