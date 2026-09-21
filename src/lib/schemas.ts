import { z } from "zod";

export const startActivitySchema = z.object({
  name: z.string().trim().min(1, "Activity name is required").max(120),
  presetMinutes: z.number().int().positive().optional(),
});
export const completeTimerSchema = z.object({ idempotencyKey: z.string().uuid().optional() });
export const timerActionSchema = z.enum(["pause", "resume", "complete", "cancel"]);
