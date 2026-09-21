export type Activity = { id: string; userId: string; name: string; normalizedName: string; lastUsedAt: Date; useCount: number };
export type Timer = { id: string; userId: string; activityId: string; startedAt: Date; accumulatedSeconds: number; pausedAt?: Date; state: "RUNNING" | "PAUSED" | "COMPLETED" | "CANCELLED" };
export type Record = { id: string; activityId: string; activityName: string; startTime: Date; endTime: Date; durationSeconds: number; status: "COMPLETED" };

export class MemoryRepository {
  activities: Activity[] = [];
  timers = new Map<string, Timer>();
  records: Record[] = [];
  completedKeys = new Map<string, Record>();
  private idempotencyKeys = new Set<string>();

  transaction<T>(work: (transaction: MemoryRepository) => T): T {
    const transaction = this.clone();
    const result = work(transaction);
    this.replaceWith(transaction);
    return result;
  }

  claimIdempotencyKey(key: string) {
    if (this.idempotencyKeys.has(key)) return false;
    this.idempotencyKeys.add(key);
    return true;
  }

  clear() {
    this.activities = [];
    this.timers.clear();
    this.records = [];
    this.completedKeys.clear();
    this.idempotencyKeys.clear();
  }

  private clone() {
    const copy = new MemoryRepository();
    copy.activities = this.activities.map((activity) => ({ ...activity, lastUsedAt: new Date(activity.lastUsedAt) }));
    copy.timers = new Map([...this.timers].map(([id, timer]) => [id, { ...timer, startedAt: new Date(timer.startedAt), pausedAt: timer.pausedAt && new Date(timer.pausedAt) }]));
    copy.records = this.records.map((record) => ({ ...record, startTime: new Date(record.startTime), endTime: new Date(record.endTime) }));
    copy.completedKeys = new Map(copy.records.map((record) => [record.id, record]));
    copy.idempotencyKeys = new Set(this.idempotencyKeys);
    return copy;
  }

  private replaceWith(transaction: MemoryRepository) {
    this.activities = transaction.activities;
    this.timers = transaction.timers;
    this.records = transaction.records;
    this.completedKeys = transaction.completedKeys;
    this.idempotencyKeys = transaction.idempotencyKeys;
  }
}

export const repository = new MemoryRepository();
