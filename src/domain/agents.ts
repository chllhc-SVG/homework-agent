import type { AgentProfile, AgentId } from "./types";

export const AGENTS: AgentProfile[] = [
  { id: "scout", name: "闻野", role: "需求洞察员", discipline: "用户研究 / 场景证据", color: "#60A5FA", glyph: "◈", principle: "先确认谁在什么场景遇到什么损失" },
  { id: "builder", name: "墨衡", role: "工作流架构师", discipline: "产品设计 / 工程拆解", color: "#F5A623", glyph: "◇", principle: "把问题拆成可交付、可验证的协作节点" },
  { id: "critic", name: "秋序", role: "风险质询员", discipline: "失败模式 / 反例", color: "#F87171", glyph: "△", principle: "先找出方案最可能在哪一步失效" },
  { id: "ethicist", name: "衡山", role: "公平与合规官", discipline: "隐私 / 公平 / 责任", color: "#C084FC", glyph: "○", principle: "让被影响的人拥有知情、拒绝和申诉的权利" },
  { id: "synth", name: "太史", role: "项目统筹官", discipline: "优先级 / 决策落地", color: "#4ADE80", glyph: "✦", principle: "把分歧收敛成负责人、验收指标和下一步" },
];

export const agentById = (id: AgentId): AgentProfile => AGENTS.find((agent) => agent.id === id) ?? AGENTS[0]!;
