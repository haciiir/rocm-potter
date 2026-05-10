import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { OpencodeClient } from "../lib/opencode";
import { createClient } from "../lib/opencode";

interface OpencodeContextValue {
  client: OpencodeClient | null;
  baseUrl: string;
  activeSessionId: string | null;
  connected: boolean;
  demoMode: boolean;
  setActiveSessionId: (id: string | null) => void;
  setDemoMode: (v: boolean) => void;
}

export const OpencodeCtx = createContext<OpencodeContextValue>({
  client: null,
  baseUrl: "",
  activeSessionId: null,
  connected: false,
  demoMode: false,
  setActiveSessionId: () => {},
  setDemoMode: () => {},
});

export function OpencodeProvider({ children }: { children: ReactNode }) {
  const envUrl = import.meta.env.VITE_OPENCODE_SERVER_URL || "";
  const [client, setClientRaw] = useState<OpencodeClient | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const connect = useCallback(async (url: string) => {
    try {
      const c = createClient(url);
      await c.session.list();
      setClientRaw(c);
      setBaseUrl(url);
      setConnected(true);
    } catch (err) {
      console.error("Failed to connect:", err);
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    if (envUrl) connect(envUrl);
  }, [envUrl, connect]);

  return (
    <OpencodeCtx.Provider value={{ client, baseUrl, activeSessionId, connected, demoMode, setActiveSessionId, setDemoMode }}>
      {children}
    </OpencodeCtx.Provider>
  );
}
