import { describe, expect, it } from "vitest";
import { createDeliberationEvents, normalizeDeliberationInput } from "../src/application/deliberation-service";

describe("议事编排层", () => {
  it("会把不可信请求输入收敛为可运行的默认议题", () => {
    const input = normalizeDeliberationInput({ topic: "  校园项目如何验收？  ", context: "  有三周时间  " });
    expect(input.topic).toBe("校园项目如何验收？");
    expect(input.context).toBe("有三周时间");
    expect(input.provider).toBe("mock");
  });

  it("事件顺序和事件 ID 可以稳定回放", () => {
    const input = { topic: "测试议题", context: "测试约束", provider: "mock" as const };
    const events = createDeliberationEvents(input);
    const replay = createDeliberationEvents(input);
    const other = createDeliberationEvents({ ...input, topic: "另一个测试议题" });
    expect(events.map((event) => event.eventId)).toEqual(replay.map((event) => event.eventId));
    expect(events.map((event) => event.eventId)).not.toEqual(other.map((event) => event.eventId));
    expect(events[0]?.eventId).toMatch(/^run-[a-f0-9]{8}-0$/);
    expect(events[1]?.eventId).toMatch(/^workflow-[a-f0-9]{8}-1$/);
    expect(events.at(-1)?.eventId).toMatch(/^completed-[a-f0-9]{8}-\d+$/);
    expect(events[0]?.type).toBe("run.started");
    expect(events.at(-1)?.type).toBe("run.completed");
    expect(events.filter((event) => event.type === "message.created")).toHaveLength(4);
    expect(events.some((event) => event.type === "workflow.created")).toBe(true);
    expect(events.some((event) => event.type === "conflict.detected")).toBe(true);
    expect(events.some((event) => event.type === "decision.ready")).toBe(true);
    expect(new Set(events.map((event) => event.eventId)).size).toBe(events.length);
  });
});
