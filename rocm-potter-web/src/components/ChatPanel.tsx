import { useOpencode } from "../hooks/useOpencode";
import AgentBlock from "./AgentBlock";

interface ChatPanelProps {
  children: Array<{ id: string; title: string; [key: string]: unknown }>;
  statuses: Record<string, { type: string }>;
}

export default function ChatPanel({ children, statuses }: ChatPanelProps) {
  const { client } = useOpencode();

  if (!client) return null;

  return (
    <aside className="w-[380px] shrink-0 border-l border-border bg-bg overflow-y-auto flex flex-col">
      <div className="h-10 flex items-center px-4 border-b border-border-subtle shrink-0">
        <span className="font-mono text-xs font-semibold text-text-muted tracking-wide uppercase">
          Agents
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children.map((child) => (
          <AgentBlock
            key={child.id}
            client={client}
            sessionId={child.id}
            title={child.title}
            status={statuses[child.id]}
          />
        ))}
      </div>
    </aside>
  );
}
