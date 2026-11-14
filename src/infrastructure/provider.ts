import type { AgentMessage, Decision } from "@/domain/types";

export interface DeliberationProvider {
  readonly name: string;
  open(topic: string, context: string): Promise<AgentMessage[]>;
  decide(topic: string, context: string): Promise<Decision>;
}

export interface ProviderConfig {
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
}

export function resolveProvider(config: ProviderConfig = {}): "mock" | "openai-compatible" {
  const engine = process.env.AGORA_ENGINE ?? "auto";
  if (engine === "mock") return "mock";
  if (engine === "live") return "openai-compatible";
  return config.apiKey && config.baseUrl ? "openai-compatible" : "mock";
}
