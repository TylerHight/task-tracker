import { errorResponse } from "@/server/http/route";
import { timerActionSchema } from "@/lib/schemas";
import { repository } from "@/server/db/repositories";
import { TimerService } from "@/server/services/timer-service";
import { NextResponse } from "next/server";
export async function POST(_: Request, context: { params: Promise<{ id: string; action: string }> }) { try { const { id, action } = await context.params; const service = new TimerService(repository); const valid = timerActionSchema.parse(action); const result = valid === "pause" ? service.pause(id) : valid === "resume" ? service.resume(id) : valid === "complete" ? service.complete(id) : service.cancel(id); return NextResponse.json({ [valid === "complete" ? "record" : "timer"]: result }); } catch (error) { return errorResponse(error); } }
