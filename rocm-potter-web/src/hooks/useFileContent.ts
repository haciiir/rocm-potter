import { useEffect, useState } from "react";
import { useOpencode } from "./useOpencode";
import { DEMO_FILE_CONTENTS } from "../lib/demo-data";

export function useFileContent(path: string | null) {
  const { client, demoMode } = useOpencode();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (demoMode) {
      if (!path) {
        setContent(null);
        return;
      }
      const demoContent = DEMO_FILE_CONTENTS[path] ?? null;
      setContent(demoContent);
      return;
    }
    if (!client || !path) {
      setContent(null);
      return;
    }
    setLoading(true);
    client.file
      .read({ query: { path } })
      .then((res) => {
        const data = res.data as { content?: string } | undefined;
        setContent(data?.content ?? null);
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [client, path, demoMode]);

  return { content, loading };
}
