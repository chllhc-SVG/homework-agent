import { AGENTS } from "./agents";
import type { AgentMessage, ConflictEdge, Decision, Evidence, AgentId } from "./types";

export const DEMO_TOPIC = "是否应该为校园二手交易平台引入 AI 自动议价？";
export const DEMO_CONTEXT = "目标用户是预算敏感、交易频繁的在校学生。平台已有 1.2 万注册用户，但纠纷率为 4.8%，客服高峰期响应超过 24 小时。";

const seedEvidence: Record<AgentId, Evidence[]> = {
  scout: [{ id: "e1", kind: "fact", label: "用户访谈", detail: "18/24 名受访者愿意尝试自动议价，但希望能随时接管。", confidence: 0.82, agentId: "scout" }],
  builder: [{ id: "e2", kind: "proposal", label: "可行性", detail: "先做规则约束的建议价，不让模型直接发出报价。", confidence: 0.91, agentId: "builder" }],
  critic: [{ id: "e3", kind: "risk", label: "反例", detail: "低价诱导会放大卖方不信任，且模型可能利用描述漏洞。", confidence: 0.76, agentId: "critic" }],
  ethicist: [{ id: "e4", kind: "assumption", label: "公平性", detail: "新生、留学生与视障用户的议价能力和信息可得性不同。", confidence: 0.7, agentId: "ethicist" }],
  synth: [{ id: "e5", kind: "proposal", label: "决策原则", detail: "AI 只做解释与建议，关键动作必须由人确认。", confidence: 0.94, agentId: "synth" }],
};

export function createOpeningMessages(topic = DEMO_TOPIC, context = DEMO_CONTEXT): AgentMessage[] {
  const now = Date.now();
  return [
    { id: "m-scout", agentId: "scout", phase: "opening", text: `我先把问题还原成用户语言：我们不是在讨论“要不要 AI”，而是在讨论“如何降低议价摩擦，又不牺牲交易信任”。${context ? ` 当前约束是：${context}` : ""}`, createdAt: now, evidence: seedEvidence.scout },
    { id: "m-builder", agentId: "builder", phase: "opening", text: `我支持做一个可逆的实验版本：${topic} 先落在“推荐区间 + 一键解释”，而不是自动替用户承诺。两周内可以用 100 笔历史订单离线验证。`, createdAt: now + 1, evidence: seedEvidence.builder },
    { id: "m-critic", agentId: "critic", phase: "opening", text: "我反对直接把转化率当成功指标。最危险的失败不是模型算错，而是用户不知道为什么被建议这个价格，最后把平台当成操纵者。", createdAt: now + 2, evidence: seedEvidence.critic, challengeTo: "builder" },
    { id: "m-ethicist", agentId: "ethicist", phase: "opening", text: "还要把不可见的用户写进验收标准：建议必须可解释、可拒绝、可撤回；不能因为用户画像而给出不同的底线。", createdAt: now + 3, evidence: seedEvidence.ethicist },
  ];
}

export function createConflicts(): ConflictEdge[] {
  return [
    { source: "critic", target: "builder", intensity: 0.88, label: "自动化边界" },
    { source: "ethicist", target: "scout", intensity: 0.48, label: "样本偏差" },
    { source: "builder", target: "critic", intensity: 0.64, label: "实验可逆性" },
    { source: "synth", target: "critic", intensity: 0.26, label: "证据强度" },
  ];
}

export function createDecision(): Decision {
  return {
    id: "decision-v1",
    title: "先做“可解释建议价”，不做自动议价",
    issue: "AI 自动议价是否应该进入校园二手交易主流程？",
    recommendation: "以 14 天影子模式上线：AI 只生成建议价区间、依据和风险提示；买卖双方均需主动确认，任何一方可关闭建议。",
    rationale: ["保留人的最终确认权，避免模型替用户做不可逆承诺。", "用离线历史订单 + 影子模式测量真实效果，成本和风险都可控。", "把纠纷率、解释阅读率、用户撤回率纳入验收，而不是只看成交率。"],
    dissent: ["墨子：如果没有真实交易闭环，实验结论可能偏保守。", "秋水：14 天不足以覆盖考试周、毕业季等极端场景。"],
    nextSteps: ["建立 100 笔脱敏订单的离线评测集", "为建议价增加‘为什么’与‘不确定性’卡片", "邀请 30 名买卖双方参与可撤回的影子模式", "每周审计不同用户群的建议偏差"],
    confidence: 0.87,
    createdAt: Date.now(),
  };
}
