import type { ParsedBenchmark } from "../types";

const METRIC_PATTERNS: [RegExp, keyof ParsedBenchmark, "float" | "int" | "string"][] = [
  [/kernel[ -_]time[:\s]+([0-9.]+)\s*ms/i, "kernelTimeMs", "float"],
  [/achieved[:\s]+([0-9.]+)\s*gflop/i, "achievedGflops", "float"],
  [/achieved[:\s]+([0-9.]+)\s*gb\/s/i, "achievedBwGbps", "float"],
  [/bw[:\s]+efficiency[:\s]+([0-9.]+)%/i, "bwEfficiency", "float"],
  [/compute[:\s]+efficiency[:\s]+([0-9.]+)%/i, "computeEfficiency", "float"],
  [/analytical[:\s]+ai[:\s]+([0-9.]+)/i, "analyticalAI", "float"],
  [/counter[:\s]+ai[:\s]+([0-9.]+)/i, "counterAI", "float"],
  [/occupancy[:\s]+([0-9.]+)%/i, "occupancy", "float"],
  [/(\d+)\s*waves?/i, "waves", "int"],
  [/vgpr[:\s]+(\d+)/i, "vgpr", "int"],
  [/sgpr[:\s]+(\d+)/i, "sgpr", "int"],
  [/lds[:\s]+(\d+)/i, "ldsBytes", "int"],
  [/valu[:\s]+util[:\s]+([0-9.]+)%/i, "valuUtil", "float"],
  [/mfma[:\s]+util[:\s]+([0-9.]+)%/i, "mfmaUtil", "float"],
  [/l2[:\s]+hit[:\s]+([0-9.]+)%/i, "l2HitRate", "float"],
  [/bottleneck[:\s]+(memory|compute|balanced)/i, "bottleneck", "string"],
];

export function parseBenchmarkOutput(output: string): Partial<ParsedBenchmark> {
  const result: Record<string, unknown> = {};

  for (const [pattern, key, type] of METRIC_PATTERNS) {
    const match = output.match(pattern);
    if (match) {
      if (type === "float") result[key] = parseFloat(match[1]);
      else if (type === "int") result[key] = parseInt(match[1], 10);
      else result[key] = match[1].toUpperCase();
    }
  }

  const aiMatch =
    result.analyticalAI != null && result.counterAI != null
      ? Math.abs(Number(result.analyticalAI) - Number(result.counterAI)) / Number(result.analyticalAI) < 0.2
      : undefined;
  if (aiMatch !== undefined) result.aiMatch = aiMatch;

  return result as Partial<ParsedBenchmark>;
}
