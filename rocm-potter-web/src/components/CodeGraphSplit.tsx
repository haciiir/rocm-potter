import { useState, useCallback } from "react";
import CodeViewer from "./CodeViewer";
import DragHandle from "./DragHandle";
import BenchmarksTab from "./BenchmarksTab";
import PortMapTab from "./PortMapTab";

interface Props {
  filePath: string | null;
  sessionId: string | null;
}

export default function CodeGraphSplit({ filePath, sessionId }: Props) {
  const [topHeight, setTopHeight] = useState(60);
  const [activeTab, setActiveTab] = useState<"benchmarks" | "portmap">("benchmarks");
  const [expanded, setExpanded] = useState(false);

  const handleDrag = useCallback((deltaY: number) => {
    setTopHeight((prev) => {
      const next = prev - (deltaY / window.innerHeight) * 100;
      return Math.max(20, Math.min(85, next));
    });
  }, []);

  const handleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
    if (!expanded) setTopHeight(20);
    else setTopHeight(60);
  }, [expanded]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div style={{ height: `${expanded ? 100 : topHeight}%` }} className="min-h-0 overflow-hidden flex flex-col">
        <CodeViewer path={filePath} />
      </div>
      <DragHandle onDrag={handleDrag} onExpand={handleExpand} isExpanded={expanded} />
      {!expanded && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex border-b border-border bg-bg-card shrink-0">
            <button className={`px-3 py-1.5 text-xs font-semibold ${activeTab === "benchmarks" ? "text-primary border-b-2 border-primary" : "text-text-muted"}`} onClick={() => setActiveTab("benchmarks")}>Benchmarks</button>
            <button className={`px-3 py-1.5 text-xs font-semibold ${activeTab === "portmap" ? "text-primary border-b-2 border-primary" : "text-text-muted"}`} onClick={() => setActiveTab("portmap")}>Port Map</button>
          </div>
          <div className="flex-1 overflow-auto">
            {activeTab === "benchmarks" ? <BenchmarksTab sessionId={sessionId} /> : <PortMapTab sessionId={sessionId} />}
          </div>
        </div>
      )}
    </div>
  );
}
