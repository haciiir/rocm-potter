import AgentBlock from "./AgentBlock";

export interface DemoPart {
  type: string;
  text?: string;
  tool?: string;
  callID?: string;
  state?: {
    status?: string;
    input?: unknown;
    output?: string;
    time?: { start?: number; end?: number };
    title?: string;
    metadata?: unknown;
  };
}

export interface DemoChild {
  id: string;
  title: string;
  messages?: Array<{ role: string; parts: DemoPart[] }>;
  [key: string]: unknown;
}

interface ChatPanelProps {
  children: Array<{ id: string; title: string; [key: string]: unknown }>;
  statuses: Record<string, { type: string }>;
  demoChildren?: DemoChild[];
}

export default function ChatPanel({ children, statuses, demoChildren }: ChatPanelProps) {
  return (
    <aside className="w-[380px] shrink-0 border-l border-border bg-bg overflow-y-auto flex flex-col">
      <div className="h-10 flex items-center px-4 border-b border-border-subtle shrink-0">
        <span className="font-mono text-xs font-semibold text-text-muted tracking-wide uppercase">
          Agents
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children.map((child) => {
          const demo = demoChildren?.find((d) => d.id === child.id);
          return (
            <AgentBlock
              key={child.id}
              sessionId={child.id}
              title={child.title}
              status={statuses[child.id]}
              demoMessages={demo?.messages}
            />
          );
        })}
      </div>
    </aside>
  );
}
