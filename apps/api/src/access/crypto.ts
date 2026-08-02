import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import argon2 from "argon2";

const TOKEN_BYTES = 32;

export function createOpaqueToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function digestOpaqueValue(value: string, pepper: string): string {
  if (!value || !pepper) throw new Error("opaque values require a non-empty value and pepper");
  return createHash("sha256").update(pepper).update("\0").update(value).digest("hex");
}

export function createLogoutProof(sessionId: string, pepper: string): string {
  return `${sessionId}.${createHmac("sha256", pepper).update(`logout:${sessionId}`).digest("base64url")}`;
}

export function verifyLogoutProof(proof: string, pepper: string): string | undefined {
  const [sessionId, signature, ...rest] = proof.split(".");
  if (!sessionId || !signature || rest.length !== 0 || !/^[0-9a-f-]{36}$/i.test(sessionId)) return undefined;
  const expected = createHmac("sha256", pepper).update(`logout:${sessionId}`).digest("base64url");
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) return undefined;
  return sessionId;
}

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 12) throw new Error("password must contain at least 12 characters");
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
