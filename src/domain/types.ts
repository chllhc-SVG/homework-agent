export type AgentId = "scout" | "builder" | "critic" | "ethicist" | "synth";
export type AgentStatus = "idle" | "thinking" | "speaking" | "done" | "error";
export type EvidenceKind = "fact" | "assumption" | "risk" | "proposal";
export type ConflictKind = "evidence" | "scope" | "risk" | "responsibility";
export type ConflictStatus = "open" | "contained" | "resolved" | "deferred";
export type WorkflowStage = "intake" | "shape" | "challenge" | "safeguard" | "commit";

export interface AgentProfile {
  id: AgentId;
  name: string;
  role: string;
  discipline: string;
  color: string;
  glyph: string;
  principle: string;
}

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  label: string;
  detail: string;
  confidence: number;
  agentId: AgentId;
}

export interface AgentMessage {
  id: string;
  agentId: AgentId;
  phase: "opening" | "cross-exam" | "synthesis" | "decision";
  text: string;
  createdAt: number;
  evidence: Evidence[];
  challengeTo?: AgentId;
}

export interface ConflictEdge {
  source: AgentId;
  target: AgentId;
  intensity: number;
  label: string;
}

export interface ConflictRecord extends ConflictEdge {
  id: string;
  kind: ConflictKind;
  status: ConflictStatus;
  claim: string;
  resolution: string;
  owner: AgentId;
  evidenceIds: string[];
  blocksWorkflow: boolean;
}

export interface WorkflowNode {
  stage: WorkflowStage;
  owner: AgentId;
  input: string;
  output: string;
  gate: string;
  status: "pending" | "ready" | "passed" | "needs-review";
}

export interface Decision {
  id: string;
  title: string;
  issue: string;
  recommendation: string;
  rationale: string[];
  dissent: string[];
  nextSteps: string[];
  confidence: number;
  createdAt: number;
}

export interface DeliberationState {
  topic: string;
  context: string;
  phase: "briefing" | "deliberating" | "decided";
  activeAgentId: AgentId | null;
  messages: AgentMessage[];
  conflicts: ConflictEdge[];
  decision: Decision | null;
}
