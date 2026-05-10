import { useState, useEffect } from "react";
import type { Part } from "@opencode-ai/sdk";
import { Loader2, RefreshCw, Check, ChevronRight, ChevronDown } from "lucide-react";
import { parseAgentType, getAgentColor, getAgentLabel } from "../lib/parse-agent";
import ToolCallRow from "./ToolCallRow";
import { useOpencode } from "../hooks/useOpencode";
import type { DemoPart } from "./ChatPanel";

interface AgentBlockProps {
  sessionId: string;
  title: string;
  status: { type: string } | undefined;
  demoMessages?: Array<{ role: string; parts: DemoPart[] }>;
}

function stripSubagent(title: string): string {
  return title.replace(/@rocm-\w+\s*/i, "").trim();
}

function getToolTime(part: Part): { start: number; end: number } | null {
  if (part.type !== "tool") return null;
  const s = part.state;
  if (s.status === "completed" || s.status === "error") {
    return { start: s.time.start, end: s.time.end };
  }
  return null;
}

export default function AgentBlock({ sessionId, title, status, demoMessages }: AgentBlockProps) {
  const { client } = useOpencode();
  const [expanded, setExpanded] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  const agentType = parseAgentType(title);
  const color = getAgentColor(agentType);
  const label = getAgentLabel(agentType);
  const displayTitle = stripSubagent(title);

  useEffect(() => {
    if (!expanded) return;
    if (demoMessages) {
      setParts(demoMessages.flatMap((m) => m.parts) as unknown as Part[]);
      return;
    }
    if (!client || loading) return;
    let cancelled = false;
    setLoading(true);
    client.session
      .messages({ path: { id: sessionId } })
      .then((res) => {
        if (!cancelled) {
          setParts(res.data?.flatMap((m) => m.parts) ?? []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [expanded, client, sessionId, demoMessages]);

  const statusType = status?.type ?? "idle";
  const StatusIcon =
    statusType === "busy"
      ? Loader2
      : statusType === "retry"
        ? RefreshCw
        : Check;
  const statusClassName =
    statusType === "busy"
      ? "animate-spin text-primary"
      : statusType === "retry"
        ? "text-primary"
        : "text-agent-reviewer";

  const toolTimes = parts
    .map((p) => getToolTime(p))
    .filter((t): t is { start: number; end: number } => t !== null);
  const firstStart = toolTimes.length > 0 ? Math.min(...toolTimes.map((t) => t.start)) : null;
  const lastEnd = toolTimes.length > 0 ? Math.max(...toolTimes.map((t) => t.end)) : null;

  const totalDuration =
    firstStart != null && lastEnd != null
      ? lastEnd - firstStart < 1000
        ? `${Math.round(lastEnd - firstStart)}ms`
        : `${((lastEnd - firstStart) / 1000).toFixed(1)}s`
      : null;

  const Chevron = expanded ? ChevronDown : ChevronRight;

  const visibleParts = parts.filter(
    (p): p is Extract<Part, { type: "text" }> | Extract<Part, { type: "tool" }> =>
      p.type === "text" || p.type === "tool"
  );

  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono hover:bg-bg-card transition-colors text-left"
      >
        <Chevron size={12} className="shrink-0 text-text-muted" />
        <span
          className="shrink-0 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-semibold" style={{ color }}>{label}</span>
        <span className="truncate flex-1">{displayTitle}</span>
        <StatusIcon size={14} className={`shrink-0 ${statusClassName}`} />
        {totalDuration && (
          <span className="text-text-muted shrink-0">{totalDuration}</span>
        )}
      </button>
      {expanded && (
        <div className="pb-2 pl-5">
          {loading ? (
            <div className="px-3 py-2 text-text-muted text-[10px]">Loading…</div>
          ) : visibleParts.length === 0 ? (
            <div className="px-3 py-2 text-text-muted text-[10px]">No messages</div>
          ) : (
            visibleParts.map((part, i) =>
              part.type === "text" ? (
                <div key={`text-${i}`} className="px-3 py-1 text-xs text-text whitespace-pre-wrap break-words">
                  {part.text}
                </div>
              ) : (
                <ToolCallRow
                  key={`tool-${part.callID}-${i}`}
                  tool={part.tool}
                  callID={part.callID}
                  state={part.state}
                />
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
