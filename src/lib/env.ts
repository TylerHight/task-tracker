import { z } from "zod";

const schema = z.object({ DATABASE_URL: z.string().url().optional(), AUTH_SECRET: z.string().min(32).optional(), GOOGLE_TOKEN_ENCRYPTION_KEY: z.string().min(32).optional() });
export const env = schema.parse({ DATABASE_URL: process.env.DATABASE_URL, AUTH_SECRET: process.env.AUTH_SECRET, GOOGLE_TOKEN_ENCRYPTION_KEY: process.env.GOOGLE_TOKEN_ENCRYPTION_KEY });
