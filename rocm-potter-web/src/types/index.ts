export const AGENT_COLORS: Record<string, string> = {
  planner: "#38bdf8",
  coder: "#e46a2c",
  profiler: "#a78bfa",
  reviewer: "#34d399",
};

export const AGENT_LABELS: Record<string, string> = {
  planner: "Planner",
  coder: "Coder",
  profiler: "Profiler",
  reviewer: "Reviewer",
};

export const MI300X_PEAKS = {
  FP32_GFLOPS: 163400,
  TF32_GFLOPS: 653700,
  FP16_GFLOPS: 1307400,
  BW_GBPS: 5325,
  RIDGE_AI_FP32: 30.7,
  RIDGE_AI_TF32: 15.3,
  RIDGE_AI_FP16: 3.84,
};

export type AgentType = "planner" | "coder" | "profiler" | "reviewer" | "unknown";

export interface ParsedBenchmark {
  kernelTimeMs: number;
  achievedGflops: number;
  achievedBwGbps: number;
  bwEfficiency: number;
  computeEfficiency: number;
  analyticalAI: number;
  counterAI: number;
  aiMatch: boolean;
  occupancy: number;
  waves: number;
  vgpr: number;
  sgpr: number;
  ldsBytes: number;
  valuUtil: number;
  mfmaUtil: number;
  l2HitRate: number;
  bottleneck: string;
}
