import { AGENT_COLORS, AGENT_LABELS, type AgentType } from "../types";

export function parseAgentType(title: string): AgentType {
  const lower = title.toLowerCase();
  if (lower.includes("rocm-planner") || lower.includes("@rocm-planner")) return "planner";
  if (lower.includes("rocm-coder") || lower.includes("@rocm-coder")) return "coder";
  if (lower.includes("rocm-profiler") || lower.includes("@rocm-profiler")) return "profiler";
  if (lower.includes("rocm-reviewer") || lower.includes("@rocm-reviewer")) return "reviewer";
  return "unknown";
}

export function getAgentColor(type: AgentType): string {
  return AGENT_COLORS[type] ?? "#5c5855";
}

export function getAgentLabel(type: AgentType): string {
  return AGENT_LABELS[type] ?? type;
}
