import { useEffect, useState, useCallback } from "react";
import { useOpencode } from "./useOpencode";
import { DEMO_SESSION, DEMO_CHILDREN, DEMO_TODOS } from "../lib/demo-data";

interface ChildSession {
  id: string;
  title: string;
  parentID?: string;
  time: { created: number; updated: number };
  [key: string]: unknown;
}

interface SessionData {
  sessions: ChildSession[];
  activeSession: ChildSession | null;
  children: ChildSession[];
  todos: Array<{ content: string; status: string; priority: string }>;
  statuses: Record<string, { type: string }>;
  activeSessionId: string | null;
}

export function useSession() {
  const { client, activeSessionId, setActiveSessionId, demoMode } = useOpencode();
  const [data, setData] = useState<SessionData>({
    sessions: [],
    activeSession: null,
    children: [],
    todos: [],
    statuses: {},
    activeSessionId,
  });

  const loadSessions = useCallback(async () => {
    if (demoMode) {
      setData({
        sessions: [DEMO_SESSION as unknown as ChildSession],
        activeSession: DEMO_SESSION as unknown as ChildSession,
        children: DEMO_CHILDREN as unknown as ChildSession[],
        todos: DEMO_TODOS,
        statuses: Object.fromEntries(DEMO_CHILDREN.map((c) => [c.id, c.status])),
        activeSessionId: DEMO_SESSION.id,
      });
      setActiveSessionId(DEMO_SESSION.id);
      return;
    }
    if (!client) return;
    try {
      const res = await client.session.list();
      const sessions = (res.data ?? []) as ChildSession[];
      const statusRes = await client.session.status();
      const statuses = (statusRes.data ?? {}) as Record<string, { type: string }>;
      setData((prev) => ({ ...prev, sessions, statuses }));
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  }, [client, demoMode, setActiveSessionId]);

  const loadActiveSession = useCallback(async () => {
    if (demoMode) {
      setData({
        sessions: [DEMO_SESSION as unknown as ChildSession],
        activeSession: DEMO_SESSION as unknown as ChildSession,
        children: DEMO_CHILDREN as unknown as ChildSession[],
        todos: DEMO_TODOS,
        statuses: Object.fromEntries(DEMO_CHILDREN.map((c) => [c.id, c.status])),
        activeSessionId: DEMO_SESSION.id,
      });
      return;
    }
    if (!client || !activeSessionId) return;
    try {
      const [sessionRes, childrenRes, todoRes] = await Promise.all([
        client.session.get({ path: { id: activeSessionId } }),
        client.session.children({ path: { id: activeSessionId } }),
        client.session.todo({ path: { id: activeSessionId } }),
      ]);
      setData((prev) => ({
        ...prev,
        activeSession: (sessionRes.data ?? null) as ChildSession | null,
        children: (childrenRes.data ?? []) as ChildSession[],
        todos: (todoRes.data ?? []) as SessionData["todos"],
      }));
    } catch (err) {
      console.error("Failed to load active session:", err);
    }
  }, [client, activeSessionId, demoMode]);

  useEffect(() => { loadSessions(); }, [loadSessions]);
  useEffect(() => { loadActiveSession(); }, [loadActiveSession]);
  useEffect(() => { setData((prev) => ({ ...prev, activeSessionId })); }, [activeSessionId]);

  return { ...data, loadSessions, loadActiveSession, setActiveSessionId };
}
