import { describe, expect, it } from "vitest";
import { createOpeningMessages } from "../src/domain/deliberation";
import { createConflictRecords, createWorkflowPlan, resolveConflictsSafely } from "../src/domain/conflict-resolution";

const messages = createOpeningMessages();

describe("冲突治理与工作流门禁", () => {
  it("冲突会被分级，责任边界冲突不会被静默吞掉", () => {
    const records = createConflictRecords(messages);
    const resolved = resolveConflictsSafely(records);
    const responsibility = resolved.find((record) => record.kind === "responsibility");
    expect(responsibility?.status).toBe("open");
    expect(responsibility?.blocksWorkflow).toBe(true);
    expect(responsibility?.resolution).toContain("人工确认");
  });

  it("高张力冲突转为可观测验证，不让编排流直接失败", () => {
    const resolved = resolveConflictsSafely(createConflictRecords(messages));
    expect(resolved.some((record) => record.status === "contained")).toBe(true);
    expect(resolved.every((record) => record.resolution.length > 0)).toBe(true);
  });

  it("工作流有明确的阶段顺序和每个阶段的责任人", () => {
    const workflow = createWorkflowPlan();
    expect(workflow.map((node) => node.stage)).toEqual(["intake", "shape", "challenge", "safeguard", "commit"]);
    expect(workflow.every((node) => node.owner && node.input && node.output && node.gate)).toBe(true);
  });
});
