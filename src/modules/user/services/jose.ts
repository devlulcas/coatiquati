import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";
import type { Payload } from "../dtos/auth.dto";

type SignTokenOptions = {
  key: Uint8Array;
  expiresIn?: string;
};

export async function signToken(
  payload: Payload,
  options: SignTokenOptions
): Promise<string> {
  if (!payload) {
    throw new Error("Payload is required");
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(options.expiresIn || "1h")
    .sign(options.key);

  return token;
}


export async function validateToken(
  token: string,
  key: Uint8Array
): Promise<Payload> {
  if (!token) throw new Error("missing user token");

  try {
    const verified = await jwtVerify(token, key);
    return verified.payload as Payload;
  } catch (error) {
    throw new Error("expired or invalid token");
  }
}