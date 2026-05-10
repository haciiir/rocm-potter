import { useEffect, useState } from "react";
import { useOpencode } from "../hooks/useOpencode";

interface FileDiff {
  file: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface Props {
  sessionId: string | null;
}

export default function PortMapTab({ sessionId }: Props) {
  const { client } = useOpencode();
  const [diffs, setDiffs] = useState<FileDiff[]>([]);

  useEffect(() => {
    if (!client || !sessionId) return;
    client.session.diff({ path: { id: sessionId } }).then((res) => {
      setDiffs((res.data ?? []) as FileDiff[]);
    }).catch(() => setDiffs([]));
  }, [client, sessionId]);

  if (!sessionId) return <div className="p-4 text-xs text-text-muted">No session selected</div>;
  if (diffs.length === 0) return <div className="p-4 text-xs text-text-muted">No file changes recorded</div>;

  return (
    <div className="p-2">
      {diffs.map((diff) => (
        <div key={diff.file} className="mb-3 border border-border-subtle rounded-md overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-card text-xs font-mono">
            <span className="text-text">{diff.file}</span>
            <span className="text-agent-reviewer">+{diff.additions}</span>
            <span className="text-red-400">-{diff.deletions}</span>
          </div>
          {diff.patch && (
            <pre className="p-2 text-[11px] font-mono max-h-64 overflow-auto text-text-muted">
              {diff.patch.split("\n").map((line, i) => {
                if (line.startsWith("+")) return <span key={i} className="text-agent-reviewer">{line}{"\n"}</span>;
                if (line.startsWith("-")) return <span key={i} className="text-red-400">{line}{"\n"}</span>;
                if (line.startsWith("@@")) return <span key={i} className="text-primary">{line}{"\n"}</span>;
                return <span key={i}>{line}{"\n"}</span>;
              })}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
