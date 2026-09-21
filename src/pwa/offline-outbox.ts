import { openDB } from "idb";
const dbPromise = typeof window === "undefined" ? undefined : openDB("task-tracker", 1, { upgrade(db) { db.createObjectStore("pending", { keyPath: "id" }); } });
export type PendingCapture = { id: string; payload: unknown; createdAt: string };
export async function queueCapture(capture: PendingCapture) { if (!dbPromise) return; (await dbPromise).put("pending", capture); }
export async function pendingCaptures() { return dbPromise ? (await dbPromise).getAll("pending") as Promise<PendingCapture[]> : []; }
export async function acknowledgeCapture(id: string) { if (dbPromise) (await dbPromise).delete("pending", id); }
