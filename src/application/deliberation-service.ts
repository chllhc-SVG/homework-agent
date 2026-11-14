import { createDecision, createOpeningMessages } from "@/domain/deliberation";
import { createConflictRecords, createWorkflowPlan, resolveConflictsSafely } from "@/domain/conflict-resolution";
import type { AgentMessage, ConflictRecord, Decision, WorkflowNode } from "@/domain/types";

export type DeliberationEvent =
  | { type: "run.started"; topic: string; provider: string; eventId: string }
  | { type: "workflow.created"; nodes: WorkflowNode[]; eventId: string }
  | { type: "message.created"; message: AgentMessage; eventId: string }
  | { type: "conflict.detected"; conflict: ConflictRecord; eventId: string }
  | { type: "conflict.contained"; conflict: ConflictRecord; eventId: string }
  | { type: "decision.ready"; decision: Decision; eventId: string }
  | { type: "run.completed"; replayable: true; eventId: string };

export interface DeliberationInput {
  topic: string;
  context: string;
  provider: string;
}

const stableToken = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  return (hash >>> 0).toString(16).slice(0, 8);
};

const eventId = (prefix: string, index: number, seed: string) => `${prefix}-${stableToken(seed)}-${index}`;

export function createDeliberationEvents(input: DeliberationInput): DeliberationEvent[] {
  const messages = createOpeningMessages(input.topic, input.context);
  const conflicts = resolveConflictsSafely(createConflictRecords(messages));
  const workflow = createWorkflowPlan();
  const events: DeliberationEvent[] = [
    { type: "run.started", topic: input.topic, provider: input.provider, eventId: eventId("run", 0, `${input.topic}|${input.context}`) },
    { type: "workflow.created", nodes: workflow, eventId: eventId("workflow", 1, `${input.topic}|${input.context}`) },
    ...messages.map((message, index) => ({ type: "message.created" as const, message, eventId: eventId("message", index + 2, `${input.topic}|${input.context}`) })),
    ...conflicts.flatMap((conflict, index): DeliberationEvent[] => [
      { type: "conflict.detected", conflict, eventId: eventId("conflict", index + 10, `${input.topic}|${input.context}`) },
      ...(conflict.status === "contained" ? [{ type: "conflict.contained" as const, conflict, eventId: eventId("contained", index + 20, `${input.topic}|${input.context}`) }] : []),
    ]),
    { type: "decision.ready", decision: createDecision(input.topic, input.context), eventId: eventId("decision", conflicts.length + 30, `${input.topic}|${input.context}`) },
    { type: "run.completed", replayable: true as const, eventId: eventId("completed", conflicts.length + 31, `${input.topic}|${input.context}`) },
  ];
  return events;
}

export function normalizeDeliberationInput(body: unknown): DeliberationInput {
  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const topic = typeof payload.topic === "string" && payload.topic.trim() ? payload.topic.trim() : "如何用多 Agent 工作流把校园创新项目从想法推进到可验证的试点？";
  const context = typeof payload.context === "string" && payload.context.trim() ? payload.context.trim() : "面向高校创新团队和大创项目负责人。团队通常跨专业、时间碎片化，需求容易漂移，评审意见难以沉淀；当前只有 3 周完成首轮验证，且需要保留用户隐私和人工决策权。";
  const provider = process.env.AGORA_ENGINE === "live" ? "openai-compatible" : "mock";
  return { topic, context, provider };
}
