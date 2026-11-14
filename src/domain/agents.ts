import type { AgentProfile, AgentId } from "./types";

export const AGENTS: AgentProfile[] = [
  { id: "scout", name: "阿衡", role: "事实侦察员", discipline: "用户研究 / 数据", color: "#60A5FA", glyph: "◈", principle: "先问证据，再下判断" },
  { id: "builder", name: "墨子", role: "方案架构师", discipline: "工程 / 产品", color: "#F5A623", glyph: "◇", principle: "把愿景压缩成可验证的下一步" },
  { id: "critic", name: "秋水", role: "反方质询官", discipline: "风险 / 反例", color: "#F87171", glyph: "△", principle: "寻找最可能失败的地方" },
  { id: "ethicist", name: "衡山", role: "影响评估师", discipline: "伦理 / 公平", color: "#C084FC", glyph: "○", principle: "让被影响的人进入讨论" },
  { id: "synth", name: "太史", role: "共识记录官", discipline: "综合 / 决策", color: "#4ADE80", glyph: "✦", principle: "记录共识，也保留异议" },
];

export const agentById = (id: AgentId): AgentProfile => AGENTS.find((agent) => agent.id === id) ?? AGENTS[0]!;
