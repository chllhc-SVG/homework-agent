import type { AgentMessage, ConflictRecord, Decision, WorkflowNode } from "./types";

export type RoomStatus = "draft" | "running" | "review" | "decided";

export interface RoomSnapshot {
  id: string;
  title: string;
  context: string;
  status: RoomStatus;
  workflow: WorkflowNode[];
  messages: AgentMessage[];
  conflicts: ConflictRecord[];
  decision: Decision | null;
  createdAt: number;
  updatedAt: number;
}

export function createRoomSnapshot(input: { id: string; title: string; context: string; now?: number }): RoomSnapshot {
  const now = input.now ?? Date.now();
  return {
    id: input.id,
    title: input.title,
    context: input.context,
    status: "draft",
    workflow: [],
    messages: [],
    conflicts: [],
    decision: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function roomStatusForEvent(type: string): RoomStatus {
  if (type === "run.started" || type === "workflow.created" || type === "message.created" || type === "conflict.detected" || type === "conflict.contained") return "running";
  if (type === "decision.ready") return "review";
  return "decided";
}
