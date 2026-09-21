import { errorResponse } from "@/server/http/route";
import { startActivitySchema } from "@/lib/schemas";
import { currentUserId } from "@/server/auth/session";
import { repository } from "@/server/db/repositories";
import { TimerService } from "@/server/services/timer-service";
import { NextResponse } from "next/server";
export async function POST(request: Request) { try { const payload = startActivitySchema.parse(await request.json()); const timer = new TimerService(repository).start(currentUserId(), payload.name); return NextResponse.json({ timer }, { status: 201 }); } catch (error) { return errorResponse(error); } }
export async function GET() { return NextResponse.json({ activities: new TimerService(repository).recent(currentUserId()) }); }
