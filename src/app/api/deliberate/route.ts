import { NextResponse } from "next/server";
import { createDecision, createOpeningMessages, DEMO_CONTEXT, DEMO_TOPIC } from "@/domain/deliberation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { topic?: string; context?: string };
  const topic = body.topic?.trim() || DEMO_TOPIC;
  const context = body.context?.trim() || DEMO_CONTEXT;
  const encoder = new TextEncoder();
  const messages = createOpeningMessages(topic, context);
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      emit({ type: "run.started", topic, provider: process.env.AI_PROVIDER || "mock" });
      for (const message of messages) {
        await new Promise((resolve) => setTimeout(resolve, 180));
        emit({ type: "message.created", message });
      }
      emit({ type: "decision.ready", decision: createDecision() });
      emit({ type: "run.completed", replayable: true });
      controller.close();
    },
  });
  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
