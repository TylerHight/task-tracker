import { MemoryRepository, repository } from "@/server/db/repositories";

export type IdempotentResult<T> = { duplicate: true } | { duplicate: false; value: T };

export function acceptIdempotencyKey(key: string, database: MemoryRepository = repository) {
  return database.transaction((transaction) => transaction.claimIdempotencyKey(key));
}

export function runIdempotent<T>(key: string, work: (transaction: MemoryRepository) => T, database: MemoryRepository = repository): IdempotentResult<T> {
  return database.transaction((transaction) => {
    if (!transaction.claimIdempotencyKey(key)) return { duplicate: true };
    return { duplicate: false, value: work(transaction) };
  });
}
