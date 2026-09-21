import { describe, expect, it } from "vitest";
import { MemoryRepository } from "@/server/db/repositories";
import { acceptIdempotencyKey, runIdempotent } from "@/server/services/outbox-service";

describe("idempotency", () => {
  it("accepts an offline capture key once", () => {
    const database = new MemoryRepository();
    const key = crypto.randomUUID();
    expect(acceptIdempotencyKey(key, database)).toBe(true);
    expect(acceptIdempotencyKey(key, database)).toBe(false);
  });

  it("does not accept a retry after a simulated acknowledgement failure", () => {
    const database = new MemoryRepository();
    const key = crypto.randomUUID();
    expect(acceptIdempotencyKey(key, database)).toBe(true);
    expect(acceptIdempotencyKey(key, database)).toBe(false);
  });

  it("commits the idempotency key and work together", () => {
    const database = new MemoryRepository();
    const key = crypto.randomUUID();
    const result = runIdempotent(key, (transaction) => {
      transaction.records.push({ id: "record-1", activityId: "activity-1", activityName: "Read", startTime: new Date(), endTime: new Date(), durationSeconds: 0, status: "COMPLETED" });
      return "record-1";
    }, database);
    expect(result).toEqual({ duplicate: false, value: "record-1" });
    expect(database.records).toHaveLength(1);
    expect(runIdempotent(key, () => "record-2", database)).toEqual({ duplicate: true });
  });

  it("rolls back an idempotency claim when the scoped work fails", () => {
    const database = new MemoryRepository();
    const key = crypto.randomUUID();
    expect(() => runIdempotent(key, () => { throw new Error("persistence failed"); }, database)).toThrow("persistence failed");
    expect(acceptIdempotencyKey(key, database)).toBe(true);
  });
});
