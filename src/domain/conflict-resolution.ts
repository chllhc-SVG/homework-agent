import type { AgentMessage, ConflictRecord, WorkflowNode } from "./types";
import { createConflicts } from "./deliberation";

/**
 * 冲突是工作流中的普通事件，不是异常。所有冲突都必须被归档、分级和给出下一步，
 * 只有安全与责任边界类冲突会阻止“承诺”，不会阻止系统继续生成可审查的决议草案。
 */
export function createConflictRecords(messages: AgentMessage[]): ConflictRecord[] {
  const evidenceByAgent = new Map(messages.map((message) => [message.agentId, message.evidence.map((item) => item.id)]));
  return createConflicts().map((edge, index) => {
    const kind = index === 1 ? "responsibility" : index === 0 ? "scope" : index === 2 ? "risk" : "evidence";
    const blocksWorkflow = kind === "responsibility" || edge.intensity >= 0.85;
    const status = blocksWorkflow ? "open" : edge.intensity >= 0.6 ? "contained" : "deferred";
    const resolution = kind === "responsibility"
      ? "转入人工确认：补齐数据用途、撤回方式和责任人后再承诺"
      : kind === "risk"
        ? "设置三周时间盒试点，用失败指标验证，不用争论替代验证"
        : kind === "scope"
          ? "拆成两个工作节点，分别登记输入、输出和通过条件"
          : "补充证据来源并记录置信度，暂不把假设写成事实";
    return {
      ...edge,
      id: `conflict-${index + 1}`,
      kind,
      status,
      claim: `${edge.label}：${edge.source} 与 ${edge.target} 对工作流推进条件的判断不同`,
      resolution,
      owner: kind === "responsibility" ? "ethicist" : kind === "risk" ? "critic" : "synth",
      evidenceIds: [...(evidenceByAgent.get(edge.source) ?? []), ...(evidenceByAgent.get(edge.target) ?? [])],
      blocksWorkflow,
    };
  });
}

export function resolveConflictsSafely(records: ConflictRecord[]): ConflictRecord[] {
  return records.map((record) => {
    if (record.kind === "responsibility") {
      return { ...record, status: "open", blocksWorkflow: true, resolution: `${record.resolution}；系统继续生成草案，但禁止进入不可逆执行。` };
    }
    if (record.status === "open") {
      return { ...record, status: "contained", blocksWorkflow: false, resolution: `${record.resolution}；已转为可观测的验证任务。` };
    }
    return record;
  });
}

export function createWorkflowPlan(): WorkflowNode[] {
  return [
    { stage: "intake", owner: "scout", input: "原始议题和背景", output: "需求卡：用户、场景、证据、假设", gate: "用户和场景明确，事实与假设分开", status: "passed" },
    { stage: "shape", owner: "builder", input: "需求卡", output: "工作流卡：阶段、依赖、输入、输出", gate: "每个节点都有可交付物", status: "passed" },
    { stage: "challenge", owner: "critic", input: "工作流卡", output: "风险卡：反例、失败条件、压力测试", gate: "至少一个失败条件可被验证", status: "needs-review" },
    { stage: "safeguard", owner: "ethicist", input: "需求卡和风险卡", output: "合规卡：脱敏、撤回、责任、人审", gate: "责任边界明确；未满足时禁止不可逆执行", status: "needs-review" },
    { stage: "commit", owner: "synth", input: "前四类工作卡和冲突记录", output: "行动决议：负责人、期限、指标、异议", gate: "冲突有归档方案；高风险项保留人工确认", status: "ready" },
  ];
}
