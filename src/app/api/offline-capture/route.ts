import { errorResponse } from "@/server/http/route";
import { repository } from "@/server/db/repositories";
import { TimerService } from "@/server/services/timer-service";
import { acceptIdempotencyKey } from "@/server/services/outbox-service";
import { NextResponse } from "next/server";
export async function POST(request: Request) { try { const key = request.headers.get("idempotency-key"); const { timerId } = await request.json(); if (!key || !timerId) return NextResponse.json({ error: "INVALID_CAPTURE" }, { status: 400 }); if (!acceptIdempotencyKey(key)) return NextResponse.json({ accepted: true, duplicate: true }); const record = new TimerService(repository).complete(timerId); return NextResponse.json({ accepted: true, record }, { status: 201 }); } catch (error) { return errorResponse(error); } }
