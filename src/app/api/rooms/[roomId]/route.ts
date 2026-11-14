import { NextResponse } from "next/server";
import { loadRoom } from "@/application/room-service";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params;
  const room = await loadRoom(roomId);
  if (!room) return NextResponse.json({ error: "ROOM_NOT_FOUND" }, { status: 404 });
  return NextResponse.json(room);
}
