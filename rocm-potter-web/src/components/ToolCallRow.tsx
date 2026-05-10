import { useState } from "react";
import type { ToolState } from "@opencode-ai/sdk";
import {
  Terminal,
  FileText,
  FilePlus,
  FilePen,
  Search,
  Bot,
  ListChecks,
  BookOpen,
  Globe,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface ToolCallRowProps {
  tool: string;
  callID: string;
  state: ToolState;
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  bash: Terminal,
  read: FileText,
  write: FilePlus,
  edit: FilePen,
  grep: Search,
  task: Bot,
  todowrite: ListChecks,
  skill: BookOpen,
  webfetch: Globe,
};

function getPrimaryField(tool: string, input: Record<string, unknown>): string {
  switch (tool) {
    case "bash": {
      const cmd = String(input.command ?? "");
      const firstLine = cmd.split("\n")[0];
      return firstLine.length > 80 ? firstLine.slice(0, 80) + "…" : firstLine;
    }
    case "read":
    case "write":
    case "edit":
      return String(input.filePath ?? "");
    case "grep":
      return String(input.pattern ?? "");
    case "task":
      return String(input.description ?? "");
    case "skill":
      return String(input.name ?? "");
    case "webfetch":
      return String(input.url ?? "");
    default:
      return "";
  }
}

function formatDuration(start: number, end?: number): string {
  if (end == null) return "";
  const ms = end - start;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function ToolCallRow({ tool, state }: ToolCallRowProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[tool] ?? Terminal;
  const primary = getPrimaryField(tool, state.input);
  const isRunning = state.status === "running" || state.status === "pending";
  const duration =
    state.status === "completed" || state.status === "error"
      ? formatDuration(state.time.start, state.time.end)
      : state.status === "running"
        ? "…"
        : "";

  const output =
    state.status === "completed"
      ? state.output
      : state.status === "error"
        ? state.error
        : null;

  const Chevron = expanded ? ChevronDown : ChevronRight;

  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-text hover:bg-bg-card transition-colors text-left"
      >
        <Chevron size={12} className="shrink-0 text-text-muted" />
        <Icon size={14} className="shrink-0 text-text-muted" />
        <span className="font-semibold text-text-muted">{tool}</span>
        <span className="truncate flex-1">{primary}</span>
        {isRunning && (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agent-profiler opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-agent-profiler" />
          </span>
        )}
        {duration && <span className="text-text-muted shrink-0">{duration}</span>}
      </button>
      {expanded && output != null && (
        <div className="px-3 pb-2 pl-8">
          <pre className="text-[10px] font-mono text-text-muted whitespace-pre-wrap break-all bg-bg rounded p-2 border border-border-subtle max-h-64 overflow-auto">
            {output.length > 1000 ? (
              <>
                {output.slice(0, 400)}
                {"\n\n"}
                <span className="text-agent-reviewer">
                  Output truncated ({output.length} chars → showing 400)
                </span>
              </>
            ) : (
              output
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
