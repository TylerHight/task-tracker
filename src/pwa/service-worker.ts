// The executable worker is emitted as public/sw.js; this module documents its cache policy.
export const serviceWorkerPolicy = { cache: "app-shell-only", records: "indexeddb-outbox" } as const;
