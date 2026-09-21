import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
export const DEMO_USER_ID = "00000000-0000-4000-8000-000000000001";
const secret = () => process.env.AUTH_SECRET ?? "development-auth-secret-not-for-production";
export function createSession(userId: string) { const signature = createHmac("sha256", secret()).update(userId).digest("base64url"); return `${userId}.${signature}`; }
export function verifySession(value?: string) { if (!value) return undefined; const [userId, signature] = value.split("."); if (!userId || !signature) return undefined; const expected = createHmac("sha256", secret()).update(userId).digest("base64url"); return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? userId : undefined; }
export function currentUserId(request?: NextRequest) { return request?.headers.get("x-user-id") ?? verifySession(request?.cookies.get("task_tracker_session")?.value) ?? DEMO_USER_ID; }
