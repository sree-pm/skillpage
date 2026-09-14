import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production-min-32-chars');

export interface JWTUser {
  id: string;
  email: string;
  role: string;
}

export async function createJWT(user: JWTUser): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTUser> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as JWTUser;
}
