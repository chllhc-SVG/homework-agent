import { createDecision, createOpeningMessages } from "@/domain/deliberation";
import type { AgentMessage, Decision } from "@/domain/types";

export type DeliberationEvent =
  | { type: "run.started"; topic: string; provider: string; eventId: string }
  | { type: "message.created"; message: AgentMessage; eventId: string }
  | { type: "decision.ready"; decision: Decision; eventId: string }
  | { type: "run.completed"; replayable: true; eventId: string };

export interface DeliberationInput {
  topic: string;
  context: string;
  provider: string;
}

const eventId = (prefix: string, index: number) => `${prefix}-${Date.now()}-${index}`;

export function createDeliberationEvents(input: DeliberationInput): DeliberationEvent[] {
  const messages = createOpeningMessages(input.topic, input.context);
  return [
    { type: "run.started", topic: input.topic, provider: input.provider, eventId: eventId("run", 0) },
    ...messages.map((message, index) => ({ type: "message.created" as const, message, eventId: eventId("message", index) })),
    { type: "decision.ready", decision: createDecision(), eventId: eventId("decision", messages.length + 1) },
    { type: "run.completed", replayable: true as const, eventId: eventId("completed", messages.length + 2) },
  ];
}

export function normalizeDeliberationInput(body: unknown): DeliberationInput {
  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const topic = typeof payload.topic === "string" && payload.topic.trim() ? payload.topic.trim() : "是否应该为校园二手交易平台引入 AI 自动议价？";
  const context = typeof payload.context === "string" && payload.context.trim() ? payload.context.trim() : "目标用户是预算敏感、交易频繁的在校学生。平台已有 1.2 万注册用户，但纠纷率为 4.8%，客服高峰期响应超过 24 小时。";
  const provider = process.env.AGORA_ENGINE === "live" ? "openai-compatible" : "mock";
  return { topic, context, provider };
}
