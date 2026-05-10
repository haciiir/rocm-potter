import { useEffect, useState, useCallback } from "react";
import { useOpencode } from "./useOpencode";
import { DEMO_FILES } from "../lib/demo-data";

export interface FileNode {
  name: string;
  path: string;
  absolute: string;
  type: "file" | "directory";
  ignored: boolean;
  children?: FileNode[];
}

interface FileTreeState {
  nodes: FileNode[];
  expanded: Set<string>;
  selectedPath: string | null;
}

function findDirNode(nodes: FileNode[], path: string): FileNode | undefined {
  for (const n of nodes) {
    if (n.path === path && n.type === "directory") return n;
    if (n.children) {
      const found = findDirNode(n.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

export function useFileTree(basePath: string | null) {
  const { client, demoMode } = useOpencode();
  const [state, setState] = useState<FileTreeState>({ nodes: [], expanded: new Set(), selectedPath: null });

  const loadDir = useCallback(
    async (path: string): Promise<FileNode[]> => {
      if (demoMode) {
        const node = findDirNode(DEMO_FILES, path);
        return node?.children ?? [];
      }
      if (!client) return [];
      try {
        const res = await client.file.list({ query: { path } });
        return (res.data ?? []) as FileNode[];
      } catch {
        return [];
      }
    },
    [client, demoMode],
  );

  useEffect(() => {
    if (demoMode) {
      setState((prev) => ({ ...prev, nodes: DEMO_FILES }));
      return;
    }
    if (!basePath) return;
    loadDir(basePath).then((nodes) => setState((prev) => ({ ...prev, nodes })));
  }, [basePath, loadDir, demoMode]);

  const toggleExpand = useCallback(
    (path: string) => {
      setState((prev) => {
        const next = new Set(prev.expanded);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        return { ...prev, expanded: next };
      });
    },
    [],
  );

  const selectFile = useCallback((path: string) => {
    setState((prev) => ({ ...prev, selectedPath: path }));
  }, []);

  return { ...state, loadDir, toggleExpand, selectFile };
}
