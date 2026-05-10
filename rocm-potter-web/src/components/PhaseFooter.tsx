interface Props {
  todos: Array<{ content: string; status: string; priority: string }>;
}

export default function PhaseFooter({ todos }: Props) {
  return (
    <footer className="h-8 flex items-center gap-1 px-4 border-t border-border bg-bg-card shrink-0 overflow-x-auto">
      {todos.map((t, i) => {
        const icon = t.status === "completed" ? "✓" : t.status === "in_progress" ? "◐" : t.status === "cancelled" ? "✗" : "○";
        const colorClass = t.status === "completed" ? "text-agent-reviewer" : t.status === "in_progress" ? "text-primary" : t.status === "cancelled" ? "text-text-muted line-through" : "text-text-muted";
        return (
          <span key={i} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap ${colorClass}`}>
            {icon} {t.content.substring(0, 20)}
          </span>
        );
      })}
      {todos.length === 0 && <span className="text-[10px] text-text-muted">No phase data</span>}
    </footer>
  );
}
