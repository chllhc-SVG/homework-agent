import type { AgentMessage, ConflictEdge, Decision, Evidence, AgentId } from "./types";

export const DEMO_TOPIC = "如何用多 Agent 工作流把校园创新项目从想法推进到可验证的试点？";
export const DEMO_CONTEXT = "面向高校创新团队和大创项目负责人。团队通常跨专业、时间碎片化，需求容易漂移，评审意见难以沉淀；当前只有 3 周完成首轮验证，且需要保留用户隐私和人工决策权。";

export function createOpeningMessages(topic = DEMO_TOPIC, context = DEMO_CONTEXT): AgentMessage[] {
  const now = Date.now();
  const lens = chooseLens(topic, context);
  const evidence = (agentId: AgentId, kind: Evidence["kind"], label: string, detail: string, confidence: number): Evidence => ({ id: `${agentId}-${stableNumber(`${topic}|${label}`)}`, kind, label, detail, confidence, agentId });
  return [
    { id: `m-scout-${stableNumber(topic)}`, agentId: "scout", phase: "opening", text: `我先把“${topic}”还原成用户和场景问题：${lens.user}在什么情况下会遇到什么损失？当前背景是：${context || "暂无背景，需要先补充证据"}。本轮先区分事实、假设和待验证问题，不直接替团队选方案。`, createdAt: now, evidence: [evidence("scout", "fact", `${lens.label}的目标用户`, `当前讨论对象是${lens.user}，需要用访谈或业务记录验证真实需求。`, 0.78)] },
    { id: `m-builder-${stableNumber(topic)}`, agentId: "builder", phase: "opening", text: `针对“${topic}”，我不建议直接做完整系统，先编排成四段工作流：需求澄清 → 方案拆解 → 风险质询 → ${lens.label}试点验收。每段只产出一种结构化工作卡，下一段消费上一段已确认的结果。`, createdAt: now + 1, evidence: [evidence("builder", "proposal", "工作流拆解", `先做${lens.pilot}，再根据${lens.metric}决定是否扩大范围。`, 0.86)] },
    { id: `m-critic-${stableNumber(topic)}`, agentId: "critic", phase: "opening", text: `我的首个质询不是“要不要做”，而是“怎样证明没有做错”。针对本议题，最需要验证的是：${lens.risk}。如果没有负责人、截止时间和失败指标，看板就会退化成漂亮的会议记录。`, createdAt: now + 2, evidence: [evidence("critic", "risk", "首要失败条件", lens.risk, 0.88)], challengeTo: "builder" },
    { id: `m-ethicist-${stableNumber(topic)}`, agentId: "ethicist", phase: "opening", text: `我会检查${lens.user}的知情、撤回和责任边界。涉及个人资料或评价时先脱敏并说明用途；涉及高风险建议、资源承诺和对外发布时必须保留人工确认，不能让模型直接执行。`, createdAt: now + 3, evidence: [evidence("ethicist", "assumption", "责任与数据边界", "参与者可知情、可撤回，项目负责人对最终动作负责。", 0.9)] },
  ];
}

export function createCrossExamMessages(topic = DEMO_TOPIC, context = DEMO_CONTEXT): Array<Pick<AgentMessage, "agentId" | "text" | "challengeTo">> {
  const lens = chooseLens(topic, context);
  return [
    { agentId: "critic", text: `我把质询落到一个可测条件：如果${lens.user}无法理解建议依据，或${lens.risk}没有记录负责人，我们就不能扩大${lens.label}。`, challengeTo: "builder" },
    { agentId: "builder", text: `接受这个门槛。我把试点改成“先观察、后承诺”：${lens.pilot}，并用${lens.metric}决定是否进入下一阶段。`, challengeTo: "critic" },
    { agentId: "synth", text: `当前可以形成有限共识：不是立即扩大自动化，而是先让${lens.user}在人工可接管的条件下验证${lens.label}；未解决的责任和风险继续保留在决议中。`, challengeTo: "ethicist" },
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

type DeliberationLens = {
  label: string;
  user: string;
  risk: string;
  pilot: string;
  metric: string;
};

function chooseLens(topic: string, context: string): DeliberationLens {
  const source = `${topic} ${context}`.toLowerCase();
  if (/节能|用电|能源|环保|碳/.test(source)) return { label: "校园节能试点", user: "宿舍学生与后勤管理者", risk: "节能建议是否会误报并增加学生负担", pilot: "选择一栋宿舍楼做两周影子试点", metric: "告警准确率、人工复核率和实际节能量" };
  if (/课程|教学|学习|考试|教育|教师/.test(source)) return { label: "校园教学改进试点", user: "学生、教师和课程负责人", risk: "建议是否放大不同基础学生之间的信息差", pilot: "选择一门课程开展一轮可撤回试用", metric: "完成率、教师接管率和学生反馈" };
  if (/招聘|求职|简历|就业|岗位/.test(source)) return { label: "校园就业服务试点", user: "学生求职者和就业指导教师", risk: "推荐是否造成隐性筛选或个人信息泄露", pilot: "使用脱敏简历进行离线评测后再开放试用", metric: "推荐解释阅读率、撤回率和人工纠正率" };
  if (/社区|志愿|公益|心理|健康/.test(source)) return { label: "校园公共服务试点", user: "服务对象、志愿者和管理人员", risk: "高风险个案是否被错误自动化处理", pilot: "先做人工审核下的影子模式", metric: "响应时间、人工升级率和投诉率" };
  return { label: "高校创新项目试点", user: "跨专业学生团队和指导教师", risk: "讨论是否停留在观点层面而没有可验收交付物", pilot: "选一个真实项目完成三周首轮验证", metric: "返工次数、完成率、异议保留率和人工接管率" };
}

export function createDecision(topic = DEMO_TOPIC, context = DEMO_CONTEXT): Decision {
  const lens = chooseLens(topic, context);
  return {
    id: `decision-${stableNumber(`${topic}|${context}`)}`,
    title: `先做${lens.label}的可逆试点，再扩大 Agent 协作范围`,
    issue: topic,
    recommendation: `围绕“${topic}”，以${lens.user}为对象，${lens.pilot}：需求洞察员提交脱敏需求卡，工作流架构师拆解方案卡，风险质询员检查“${lens.risk}”，公平与合规官完成数据和责任检查，项目统筹官最终生成负责人、截止时间和验收指标。AI 只提出建议，团队成员确认后才进入下一节点。`,
    rationale: ["每个 Agent 只负责一种类型的产出，减少多角色重复回答和上下文漂移。", `把“${lens.risk}”转成可观测约束，而不是用观点争论代替验证。`, `将${lens.metric}纳入验收，避免只用单一结果判断试点成败。`],
    dissent: ["墨衡：完整工作流可能让低风险议题变慢，需要保留快速通道。", "秋序：首轮试点只能验证当前假设，不能直接证明长期价值。"],
    nextSteps: [`围绕“${topic}”建立${lens.label}的脱敏样本和参与者说明`, "为五个工作节点分别定义输入、输出和通过条件", `邀请${lens.user}参与可撤回的影子模式`, `复盘${lens.metric}`],
    confidence: 0.89,
    createdAt: Date.now(),
  };
}

function stableNumber(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  return (hash >>> 0).toString(16).slice(0, 8);
}
