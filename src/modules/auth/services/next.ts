import { cookies } from "next/headers";
import { cache } from "react";
import { SESSION_COOKIE_NAME } from "../constants/cookies";
import type { PublicSession } from "../types/session";
import { toPublicSession, validateSessionToken } from "./auth";

export async function getSessionTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  return token;
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
}

export const validateRequest = cache(
  async (): Promise<PublicSession> => {
    const token = await getSessionTokenCookie();

    const emptySession: PublicSession = {
      data: null,
      status: "unauthenticated",
    }

    if (!token) {
      return emptySession;
    }

    const result = await validateSessionToken(token);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session) {
        return toPublicSession(result.user)
      } else {
        await deleteSessionTokenCookie();
      }
    } catch { }

    return emptySession;
  },
);
