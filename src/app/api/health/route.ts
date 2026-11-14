import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    service: "agora-board",
    status: "ok",
    provider: process.env.AGORA_ENGINE === "live" ? "openai-compatible" : "mock",
    storage: "json-event-log",
    version: "1.0.0",
    checkedAt: new Date().toISOString(),
  });
}
