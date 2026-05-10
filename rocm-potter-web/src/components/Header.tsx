import { useOpencode } from "../hooks/useOpencode";
import SessionPicker from "./SessionPicker";

export default function Header() {
  const { connected, baseUrl, setActiveSessionId, demoMode, setDemoMode } = useOpencode();

  return (
    <header className="h-12 flex items-center px-4 border-b border-border bg-bg-card shrink-0 gap-3">
      <span className="font-mono text-primary font-bold text-sm tracking-tight">rocm-potter</span>
      <div className="flex-1" />
      <button
        onClick={() => setDemoMode(!demoMode)}
        className={`px-2 py-0.5 text-xs font-mono border rounded transition-colors ${
          demoMode
            ? "bg-agent-profiler text-bg border-agent-profiler"
            : "text-text-muted border-border hover:border-primary hover:text-primary"
        }`}
      >
        Demo
      </button>
      {connected && !demoMode && (
        <button
          onClick={() => setActiveSessionId(null)}
          className="px-2 py-0.5 text-xs font-mono text-primary border border-primary rounded hover:bg-primary hover:text-bg transition-colors"
        >
          + New
        </button>
      )}
      {connected && !demoMode && <SessionPicker />}
      <span className={`text-xs font-mono ${demoMode ? "text-agent-profiler" : connected ? "text-agent-planner" : "text-text-muted"}`}>
        {demoMode ? "demo" : connected ? "connected" : "disconnected"}
      </span>
      {connected && !demoMode && (
        <span className="text-[10px] text-text-muted font-mono">{baseUrl}</span>
      )}
    </header>
  );
}
