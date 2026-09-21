import { createSession, DEMO_USER_ID } from "@/server/auth/session";
import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ user: { id: DEMO_USER_ID } }); }
export async function POST() { const response = NextResponse.json({ user: { id: DEMO_USER_ID } }); response.cookies.set("task_tracker_session", createSession(DEMO_USER_ID), { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" }); return response; }
