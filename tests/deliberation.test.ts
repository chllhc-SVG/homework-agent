import { describe, expect, it } from "vitest";
import { createConflicts, createCrossExamMessages, createDecision, createOpeningMessages, DEMO_CONTEXT, DEMO_TOPIC } from "../src/domain/deliberation";


describe("议场领域层", () => {
  it("能生成五个视角中的四个开场陈述，并保留证据链", () => {
    const messages = createOpeningMessages(DEMO_TOPIC, DEMO_CONTEXT);
    expect(messages).toHaveLength(4);
    expect(messages.every((message) => message.evidence.length > 0)).toBe(true);
    expect(messages.map((message) => message.agentId)).toEqual(["scout", "builder", "critic", "ethicist"]);
  });

  it("同一输入可以稳定复现，不同议题会产生不同角色产出", () => {
    const energy = createOpeningMessages("如何做校园节能试点？", "宿舍用电数据需要脱敏，先验证告警准确率。");
    const energyAgain = createOpeningMessages("如何做校园节能试点？", "宿舍用电数据需要脱敏，先验证告警准确率。");
    const teaching = createOpeningMessages("如何改进课程反馈？", "教师希望减少重复整理，学生希望能撤回意见。");
    expect(energy.map((message) => message.text)).toEqual(energyAgain.map((message) => message.text));
    expect(energy.map((message) => message.text)).not.toEqual(teaching.map((message) => message.text));
    expect(createCrossExamMessages("如何做校园节能试点？").at(0)?.text).toContain("节能");
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
