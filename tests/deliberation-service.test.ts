import { describe, expect, it } from "vitest";
import { createDeliberationEvents, normalizeDeliberationInput } from "../src/application/deliberation-service";

describe("议事编排层", () => {
  it("会把不可信请求输入收敛为可运行的默认议题", () => {
    const input = normalizeDeliberationInput({ topic: "  校园项目如何验收？  ", context: "  有三周时间  " });
    expect(input.topic).toBe("校园项目如何验收？");
    expect(input.context).toBe("有三周时间");
    expect(input.provider).toBe("mock");
  });

  it("事件顺序可被完整回放", () => {
    const events = createDeliberationEvents({ topic: "测试议题", context: "测试约束", provider: "mock" });
    expect(events[0]?.type).toBe("run.started");
    expect(events.at(-1)?.type).toBe("run.completed");
    expect(events.filter((event) => event.type === "message.created")).toHaveLength(4);
    expect(new Set(events.map((event) => event.eventId)).size).toBe(events.length);
  });
});
