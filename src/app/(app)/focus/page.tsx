"use client";
import { useState } from "react";
import { ActivityStart } from "@/components/activity-start";
import { FocusTimer } from "@/components/focus-timer";
import { queueCapture } from "@/pwa/offline-outbox";
export default function FocusPage() { const [timer, setTimer] = useState<{ id: string; state: string } | null>(null); const queueOfflineCompletion = async (timerId: string) => queueCapture({ id: crypto.randomUUID(), payload: { timerId }, createdAt: new Date().toISOString() }); return <div className="stack"><h1>Focus</h1><p className="muted">Start with only an activity name.</p>{timer ? <FocusTimer timer={timer} onFinalized={() => setTimer(null)} onOfflineComplete={queueOfflineCompletion} /> : <ActivityStart onStarted={setTimer} />}</div>; }
