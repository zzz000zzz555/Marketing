// lib/auth.ts — Autenticación robusta (Argon2id / bcrypt)
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "dev-secret-change-me");
const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 15 * 60; // 15 min para admin, 7 días para clientes (ajustar por rol)

export type SessionPayload = {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
  mfaVerified: boolean;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export function requireRole(session: SessionPayload | null, roles: SessionPayload["role"][]): boolean {
  if (!session) return false;
  return roles.includes(session.role);
}