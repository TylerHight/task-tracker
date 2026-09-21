import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
const key = () => Buffer.from((process.env.GOOGLE_TOKEN_ENCRYPTION_KEY ?? "development-key-must-be-32-bytes!!").padEnd(32).slice(0, 32));
export function encryptRefreshToken(value: string) { const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", key(), iv); const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]); return `${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${encrypted.toString("base64")}`; }
export function decryptRefreshToken(value: string) { const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64")); const decipher = createDecipheriv("aes-256-gcm", key(), iv); decipher.setAuthTag(tag); return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8"); }
type OAuthAttempt = { verifier: string; scopes: string[]; expiresAt: number };
const attempts = new Map<string, OAuthAttempt>();
const credentials = new Map<string, { encryptedRefreshToken: string; scopes: string[]; revoked: boolean }>();
const base64url = (bytes: Buffer) => bytes.toString("base64url");
export function beginGoogleAuthorization(scopes: string[]) { const state = base64url(randomBytes(32)); const verifier = base64url(randomBytes(48)); attempts.set(state, { verifier, scopes: [...new Set(scopes)], expiresAt: Date.now() + 10 * 60_000 }); return { state, codeVerifier: verifier, codeChallenge: base64url(createHash("sha256").update(verifier).digest()) }; }
export function consumeGoogleAuthorization(state: string, codeVerifier: string) { const attempt = attempts.get(state); attempts.delete(state); if (!attempt || attempt.expiresAt < Date.now() || attempt.verifier !== codeVerifier) throw new Error("Invalid OAuth state or PKCE verifier"); return attempt.scopes; }
export function storeGoogleCredential(userId: string, refreshToken: string, scopes: string[]) { credentials.set(userId, { encryptedRefreshToken: encryptRefreshToken(refreshToken), scopes: [...new Set(scopes)], revoked: false }); }
export function grantedScopes(userId: string) { const credential = credentials.get(userId); return credential && !credential.revoked ? credential.scopes : []; }
export function revokeGoogleCredential(userId: string) { const credential = credentials.get(userId); if (credential) credential.revoked = true; }
