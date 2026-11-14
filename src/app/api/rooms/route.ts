import { NextResponse } from "next/server";
import { startRoom } from "@/application/room-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await startRoom(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ROOM_CREATE_FAILED";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
