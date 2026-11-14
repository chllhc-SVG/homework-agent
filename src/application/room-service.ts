import { createDeliberationEvents, normalizeDeliberationInput } from "./deliberation-service";
import { appendRoomEvents, createRoom, getRoom } from "@/infrastructure/room-store";

export async function startRoom(body: unknown) {
  const input = normalizeDeliberationInput(body);
  const room = await createRoom({ title: input.topic, context: input.context });
  const events = createDeliberationEvents(input);
  return appendRoomEvents(room.id, events);
}

export async function loadRoom(roomId: string) {
  return getRoom(roomId);
}
