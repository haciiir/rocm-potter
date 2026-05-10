import { useCallback, useState } from "react";
import { OpencodeProvider } from "./context/OpencodeContext";
import { useOpencode } from "./hooks/useOpencode";
import { useSession } from "./hooks/useSession";
import { useSSE } from "./hooks/useSSE";
import Header from "./components/Header";
import FileTree from "./components/FileTree";
import CodeGraphSplit from "./components/CodeGraphSplit";
import ChatPanel from "./components/ChatPanel";
import PhaseFooter from "./components/PhaseFooter";
import KernelSubmit from "./components/KernelSubmit";

function AppContent() {
  const { connected, activeSessionId, setActiveSessionId } = useOpencode();
  const { children, statuses, todos, loadSessions, loadActiveSession } = useSession();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleSSEEvent = useCallback(
    (event: { type: string; properties: Record<string, unknown> }) => {
      if (event.type === "session.created" || event.type === "session.updated" || event.type === "session.deleted" || event.type === "session.status") {
        loadSessions();
      }
      if (event.type === "session.idle" || event.type === "todo.updated" || event.type === "message.updated") {
        loadActiveSession();
      }
    },
    [loadSessions, loadActiveSession],
  );

  useSSE(handleSSEEvent);

  if (!connected) {
    return (
      <main className="flex-1 flex items-center justify-center text-text-muted text-sm">
        Connecting to opencode server...
      </main>
    );
  }

  if (!activeSessionId || showSubmit) {
    return (
      <>
        <div className="flex-1 flex flex-col min-h-0">
          <KernelSubmit onSessionCreated={(id) => { setShowSubmit(false); setActiveSessionId(id); }} />
        </div>
        <PhaseFooter todos={[]} />
      </>
    );
  }

  return (
    <>
      <div className="flex-1 flex min-h-0">
        <FileTree basePath="kernels" onSelectFile={setSelectedFile} />
        <CodeGraphSplit filePath={selectedFile} sessionId={activeSessionId} />
        <ChatPanel children={children as Array<{ id: string; title: string; [key: string]: unknown }>} statuses={statuses} />
      </div>
      <PhaseFooter todos={todos} />
    </>
  );
}

export default function App() {
  return (
    <OpencodeProvider>
      <div className="h-screen flex flex-col bg-bg text-text font-sans">
        <Header />
        <AppContent />
      </div>
    </OpencodeProvider>
  );
}
