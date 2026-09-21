import { beforeEach, describe, expect, it } from "vitest";
import { repository } from "@/server/db/repositories";
import { TimerService } from "@/server/services/timer-service";
describe("TimerService", () => { beforeEach(() => repository.clear()); it("excludes paused time and completes a record", () => { const service = new TimerService(repository, () => new Date("2026-09-11T12:00:00Z")); const timer = service.start("u", "Read"); service.pause(timer.id); service.resume(timer.id); const record = service.complete(timer.id); expect(record.status).toBe("COMPLETED"); expect(record.durationSeconds).toBeGreaterThanOrEqual(0); }); });
