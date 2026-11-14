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
    const energyInput = { topic: "如何做校园节能试点？", context: "宿舍用电数据需要脱敏，先验证告警准确率。" };
    const teachingInput = { topic: "如何改进课程反馈？", context: "教师希望减少重复整理，学生希望能撤回意见。" };
    const energy = createOpeningMessages(energyInput.topic, energyInput.context);
    const energyAgain = createOpeningMessages(energyInput.topic, energyInput.context);
    const teaching = createOpeningMessages(teachingInput.topic, teachingInput.context);
    expect(energy.map((message) => message.text)).toEqual(energyAgain.map((message) => message.text));
    expect(energy.map((message) => message.text)).not.toEqual(teaching.map((message) => message.text));
    expect(energy[0]?.evidence[0]?.detail).toContain("宿舍学生");
    expect(energy[2]?.evidence[0]?.detail).toContain("误报");
    expect(energy[1]?.evidence[0]?.detail).toContain("两周影子试点");
    expect(energy[1]?.evidence[0]?.detail).toContain("告警准确率");
    expect(teaching[0]?.evidence[0]?.detail).toContain("学生、教师");
    expect(teaching[2]?.evidence[0]?.detail).toContain("信息差");
    expect(teaching[1]?.evidence[0]?.detail).toContain("一门课程");
    expect(teaching[1]?.evidence[0]?.detail).toContain("完成率");
  });

  it("交叉质询消费当前场景，而不是继续复用旧业务文案", () => {
    const energy = createCrossExamMessages("如何做校园节能试点？", "宿舍用电数据需要脱敏").map((message) => message.text).join("\\n");
    const teaching = createCrossExamMessages("如何改进课程反馈？", "教师希望减少整理").map((message) => message.text).join("\\n");
    expect(energy).toContain("校园节能试点");
    expect(energy).toContain("告警准确率");
    expect(teaching).toContain("校园教学改进试点");
    expect(teaching).toContain("教师接管率");
    expect(energy).not.toContain("自动议价");
    expect(teaching).not.toContain("自动议价");
    expect(energy).not.toEqual(teaching);
  });

  it("决议书的议题、建议和行动项都来自当前输入", () => {
    const decision = createDecision("如何做校园节能试点？", "宿舍用电数据需要脱敏，先验证告警准确率。");
    expect(decision.issue).toBe("如何做校园节能试点？");
    expect(decision.recommendation).toContain("校园节能试点");
    expect(decision.nextSteps.join("\\n")).toContain("校园节能试点");
    expect(decision.nextSteps.join("\\n")).toContain("告警准确率");
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
