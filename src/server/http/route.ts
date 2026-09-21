import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";
export function errorResponse(error: unknown) { if (error instanceof AppError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status }); return NextResponse.json({ error: "INTERNAL", message: "Unexpected error" }, { status: 500 }); }
