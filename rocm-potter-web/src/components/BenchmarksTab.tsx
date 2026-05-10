import { useEffect, useState } from "react";
import { useOpencode } from "../hooks/useOpencode";
import { parseBenchmarkOutput } from "../lib/parse-benchmark";
import { DEMO_BENCHMARK_METRICS } from "../lib/demo-data";
import type { ParsedBenchmark } from "../types";
import RooflineChart from "./RooflineChart";
import MetricTable from "./MetricTable";

interface Props {
  sessionId: string | null;
}

export default function BenchmarksTab({ sessionId }: Props) {
  const { client, demoMode } = useOpencode();
  const [metrics, setMetrics] = useState<Partial<ParsedBenchmark>>({});

  useEffect(() => {
    if (demoMode) {
      setMetrics(DEMO_BENCHMARK_METRICS as ParsedBenchmark);
      return;
    }
    if (!client || !sessionId) return;
    (async () => {
      try {
        const childrenRes = await client.session.children({ path: { id: sessionId } });
        const children = childrenRes.data ?? [];
        const profilerSessions = children.filter(
          (s: { title?: string }) => (s.title ?? "").toLowerCase().includes("profiler"),
        );
        for (const ps of profilerSessions) {
          const msgsRes = await client.session.messages({
            path: { id: (ps as { id: string }).id },
          });
          const msgs = msgsRes.data ?? [];
          for (const msg of msgs) {
            const parts =
              (msg as {
                parts?: Array<{
                  type: string;
                  tool?: string;
                  state?: { output?: string; status?: string };
                }>;
              }).parts ?? [];
            for (const part of parts) {
              if (
                part.type === "tool" &&
                part.tool === "bash" &&
                part.state?.status === "completed" &&
                part.state.output
              ) {
                const parsed = parseBenchmarkOutput(part.state.output);
                if (Object.keys(parsed).length > 0) {
                  setMetrics(parsed);
                  return;
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load benchmarks:", err);
      }
    })();
  }, [client, sessionId, demoMode]);

  if (!sessionId && !demoMode)
    return <div className="p-4 text-xs text-text-muted">No session selected</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="h-[55%] min-h-[200px] border-b border-border p-2">
        <RooflineChart
          achievedGflops={metrics.achievedGflops}
          achievedAI={metrics.analyticalAI}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <MetricTable metrics={metrics} />
      </div>
    </div>
  );
}
