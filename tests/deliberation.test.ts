import { describe, expect, it } from "vitest";
import { createConflicts, createDecision, createOpeningMessages, DEMO_CONTEXT, DEMO_TOPIC } from "../src/domain/deliberation";


describe("议场领域层", () => {
  it("能生成五个视角中的四个开场陈述，并保留证据链", () => {
    const messages = createOpeningMessages(DEMO_TOPIC, DEMO_CONTEXT);
    expect(messages).toHaveLength(4);
    expect(messages.every((message) => message.evidence.length > 0)).toBe(true);
    expect(messages.map((message) => message.agentId)).toEqual(["scout", "builder", "critic", "ethicist"]);
  });

  it("冲突图谱只描述关系，不篡改消息事实", () => {
    const edges = createConflicts();
    expect(edges).toHaveLength(4);
    expect(edges.every((edge) => edge.intensity >= 0 && edge.intensity <= 1)).toBe(true);
    expect(edges.some((edge) => edge.label === "建议还是可交付节点")).toBe(true);
  });

  it("决议必须同时包含行动、异议和下一步", () => {
    const decision = createDecision();
    expect(decision.recommendation.length).toBeGreaterThan(20);
    expect(decision.dissent.length).toBeGreaterThan(0);
    expect(decision.nextSteps.length).toBeGreaterThanOrEqual(3);
  });
});
