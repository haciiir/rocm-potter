import { useSession } from "../hooks/useSession";

export default function SessionPicker() {
  const { sessions, activeSessionId, setActiveSessionId } = useSession();
  const rootSessions = sessions.filter((s) => !s.parentID);

  if (rootSessions.length === 0) {
    return <span className="text-text-muted text-xs">No sessions found</span>;
  }

  return (
    <select
      value={activeSessionId ?? ""}
      onChange={(e) => setActiveSessionId(e.target.value || null)}
      className="bg-bg border border-border-subtle rounded px-2 py-1 text-xs font-mono text-text max-w-56 focus:outline-none focus:border-primary"
    >
      <option value="">Select a session...</option>
      {rootSessions.map((s) => (
        <option key={s.id} value={s.id}>
          {s.title || s.id}
        </option>
      ))}
    </select>
  );
}
