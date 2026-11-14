import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DeliberationEvent } from "@/application/deliberation-service";
import { createRoomSnapshot, roomStatusForEvent } from "@/domain/room";
import type { RoomSnapshot } from "@/domain/room";

export interface StoredEvent {
  roomId: string;
  sequence: number;
  recordedAt: number;
  event: DeliberationEvent;
}

const rootDirectory = () => path.resolve(process.env.AGORA_DATA_DIR ?? "data/rooms");
const validRoomId = (roomId: string) => /^[a-z0-9-]{8,80}$/i.test(roomId);
const roomPath = (roomId: string) => path.join(rootDirectory(), `${roomId}.json`);

async function readRoomFile(roomId: string): Promise<{ snapshot: RoomSnapshot; events: StoredEvent[] } | null> {
  if (!validRoomId(roomId)) return null;
  try {
    return JSON.parse(await readFile(roomPath(roomId), "utf8")) as { snapshot: RoomSnapshot; events: StoredEvent[] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function writeRoomFile(roomId: string, value: { snapshot: RoomSnapshot; events: StoredEvent[] }) {
  await mkdir(rootDirectory(), { recursive: true });
  const target = roomPath(roomId);
  const temporary = `${target}.tmp`;
  await writeFile(temporary, JSON.stringify(value, null, 2), "utf8");
  await rename(temporary, target);
}

export async function createRoom(input: { title: string; context: string; now?: number }) {
  const id = `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const snapshot = createRoomSnapshot({ id, ...input });
  await writeRoomFile(id, { snapshot, events: [] });
  return snapshot;
}

export async function appendRoomEvents(roomId: string, events: DeliberationEvent[]) {
  const current = await readRoomFile(roomId);
  if (!current) throw new Error("ROOM_NOT_FOUND");
  const recordedAt = Date.now();
  const storedEvents = events.map((event, index) => ({ roomId, sequence: current.events.length + index + 1, recordedAt: recordedAt + index, event }));
  const snapshot = events.reduce((state, item) => {
    if (item.type === "workflow.created") return { ...state, workflow: item.nodes };
    if (item.type === "message.created") return { ...state, messages: [...state.messages, item.message] };
    if (item.type === "conflict.detected") return { ...state, conflicts: [...state.conflicts, item.conflict] };
    if (item.type === "conflict.contained") return { ...state, conflicts: state.conflicts.map((conflict) => conflict.id === item.conflict.id ? item.conflict : conflict) };
    if (item.type === "decision.ready") return { ...state, decision: item.decision };
    return state;
  }, current.snapshot);
  const finalSnapshot = { ...snapshot, updatedAt: Date.now(), status: roomStatusForEvent(events.at(-1)?.type ?? "run.completed") };
  await writeRoomFile(roomId, { snapshot: finalSnapshot, events: [...current.events, ...storedEvents] });
  return { snapshot: finalSnapshot, events: storedEvents };
}

export async function getRoom(roomId: string) {
  return readRoomFile(roomId);
}
