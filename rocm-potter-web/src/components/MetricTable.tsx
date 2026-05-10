import type { ParsedBenchmark } from "../types";

interface Props {
  metrics: Partial<ParsedBenchmark>;
}

const ROWS: { key: keyof ParsedBenchmark; label: string; fmt: (v: unknown) => string }[] = [
  { key: "kernelTimeMs", label: "Kernel Time", fmt: (v) => `${v} ms` },
  { key: "achievedGflops", label: "Achieved GFLOP/s", fmt: (v) => `${v}` },
  { key: "achievedBwGbps", label: "Achieved BW", fmt: (v) => `${v} GB/s` },
  { key: "bwEfficiency", label: "BW Efficiency", fmt: (v) => `${v}%` },
  { key: "computeEfficiency", label: "Compute Efficiency", fmt: (v) => `${v}%` },
  { key: "analyticalAI", label: "Analytical AI", fmt: (v) => `${v} OP/B` },
  { key: "counterAI", label: "Counter AI", fmt: (v) => `${v} OP/B` },
  { key: "aiMatch", label: "AI Match", fmt: (v) => (v ? "Yes" : "No") },
  { key: "occupancy", label: "Occupancy", fmt: (v) => `${v}%` },
  { key: "waves", label: "Waves", fmt: (v) => `${v}` },
  { key: "vgpr", label: "VGPR", fmt: (v) => `${v}/wave` },
  { key: "sgpr", label: "SGPR", fmt: (v) => `${v}/wave` },
  { key: "ldsBytes", label: "LDS", fmt: (v) => `${v} B/WG` },
  { key: "valuUtil", label: "VALU Util", fmt: (v) => `${v}%` },
  { key: "mfmaUtil", label: "MFMA Util", fmt: (v) => `${v}%` },
  { key: "l2HitRate", label: "L2 Hit Rate", fmt: (v) => `${v}%` },
  { key: "bottleneck", label: "Bottleneck", fmt: (v) => String(v) },
  { key: "keyFinding", label: "Key Finding", fmt: (v) => String(v) },
];

export default function MetricTable({ metrics }: Props) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-xs font-mono">
        <tbody>
          {ROWS.map(({ key, label, fmt }) => {
            const value = metrics[key];
            if (value == null) return null;
            return (
              <tr key={key} className="border-b border-border-subtle">
                <td className="px-3 py-1.5 text-text-muted whitespace-nowrap">{label}</td>
                <td className="px-3 py-1.5 text-text text-right whitespace-nowrap">{fmt(value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
