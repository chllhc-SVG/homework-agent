import type { AgentMessage, ConflictEdge, Decision, Evidence, AgentId } from "./types";

export const DEMO_TOPIC = "如何用多 Agent 工作流把校园创新项目从想法推进到可验证的试点？";
export const DEMO_CONTEXT = "面向高校创新团队和大创项目负责人。团队通常跨专业、时间碎片化，需求容易漂移，评审意见难以沉淀；当前只有 3 周完成首轮验证，且需要保留用户隐私和人工决策权。";

const seedEvidence: Record<AgentId, Evidence[]> = {
  scout: [{ id: "e1", kind: "fact", label: "需求访谈", detail: "12 个校园创新团队中有 9 个表示：最难的不是提出想法，而是把分歧变成明确的下一步。", confidence: 0.83, agentId: "scout" }],
  builder: [{ id: "e2", kind: "proposal", label: "工作流拆解", detail: "将议题拆成需求澄清、方案设计、风险检查、试点验证四个可交付节点，每个节点只产生一种结果。", confidence: 0.92, agentId: "builder" }],
  critic: [{ id: "e3", kind: "risk", label: "失败模式", detail: "如果所有 Agent 都只给建议而没有负责人、截止时间和验收指标，看板会变成更漂亮的聊天记录。", confidence: 0.9, agentId: "critic" }],
  ethicist: [{ id: "e4", kind: "assumption", label: "责任边界", detail: "涉及学生访谈和项目数据时，必须脱敏、说明用途，并允许参与者撤回；AI 不能替团队做最终承诺。", confidence: 0.88, agentId: "ethicist" }],
  synth: [{ id: "e5", kind: "proposal", label: "决策原则", detail: "每轮协作都必须留下结论、异议、负责人、验收指标和下一次复盘时间。", confidence: 0.95, agentId: "synth" }],
};

export function createOpeningMessages(topic = DEMO_TOPIC, context = DEMO_CONTEXT): AgentMessage[] {
  const now = Date.now();
  return [
    { id: "m-scout", agentId: "scout", phase: "opening", text: `我先把议题还原成团队问题：这不是“要不要用 AI”，而是“如何让跨专业团队在有限时间内把分歧转成可验证的行动”。${context ? ` 当前边界是：${context}` : ""}`, createdAt: now, evidence: seedEvidence.scout },
    { id: "m-builder", agentId: "builder", phase: "opening", text: `我建议把${topic}编排成一条四段式工作流：需求澄清 → 方案拆解 → 风险检查 → 试点验收。每段由对应角色产出结构化卡片，下一段只能消费上一段已确认的结果。`, createdAt: now + 1, evidence: seedEvidence.builder },
    { id: "m-critic", agentId: "critic", phase: "opening", text: "我先提出一个硬门槛：如果看板没有明确负责人、截止时间和验收指标，它只是把会议记录换成了 AI 文案。首轮试点必须能在三周内证明至少一个关键假设。", createdAt: now + 2, evidence: seedEvidence.critic, challengeTo: "builder" },
    { id: "m-ethicist", agentId: "ethicist", phase: "opening", text: "还要把参与者的权利写进工作流：访谈数据先脱敏，采集前说明用途，参与者可以撤回；涉及对外承诺、资源申请和评价时，必须由人确认。", createdAt: now + 3, evidence: seedEvidence.ethicist },
  ];
}

export function createConflicts(): ConflictEdge[] {
  return [
    { source: "critic", target: "builder", intensity: 0.88, label: "建议还是可交付节点" },
    { source: "ethicist", target: "scout", intensity: 0.48, label: "证据使用边界" },
    { source: "builder", target: "critic", intensity: 0.64, label: "三周试点可行性" },
    { source: "synth", target: "critic", intensity: 0.34, label: "验收指标强度" },
  ];
}

export function createDecision(): Decision {
  return {
    id: "decision-v2",
    title: "先落地四段式协作工作流，再扩展 Agent 数量",
    issue: "如何用多 Agent 工作流把校园创新项目从想法推进到可验证的试点？",
    recommendation: "以一个真实校园创新项目做三周试点：由需求洞察员提交脱敏需求卡，工作流架构师拆解方案卡，风险质询员建立失败条件，公平与合规官完成数据和责任检查，项目统筹官最终生成负责人、截止时间和验收指标。AI 只提出建议，团队成员确认后才进入下一节点。",
    rationale: ["每个 Agent 只负责一种类型的产出，减少多角色重复回答和上下文漂移。", "用负责人、截止时间和验收指标把讨论结果转成真正可执行的工作项。", "将隐私、撤回和人工确认设置为工作流门槛，避免 AI 直接替团队做承诺。"],
    dissent: ["墨衡：四段式流程可能让探索期变慢，需要允许低风险议题快速通过。", "秋序：三周试点只能验证工作流可用性，不能直接证明项目长期价值。"],
    nextSteps: ["选择一个跨专业校园创新项目，建立脱敏议题样本", "为四个工作节点分别定义输入、输出和通过条件", "邀请 5 名学生完成一轮真实协作并记录接管点", "复盘完成率、返工次数、异议保留率和人工接管率"],
    confidence: 0.89,
    createdAt: Date.now(),
  };
}
