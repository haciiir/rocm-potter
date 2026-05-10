export type SSEEventHandler = (event: { type: string; properties: Record<string, unknown> }) => void;

export function subscribeSSE(baseUrl: string, onEvent: SSEEventHandler): () => void {
  const url = `${baseUrl}/event`;
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(url, { signal: controller.signal });
      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const payload = JSON.parse(line.slice(6));
              onEvent(payload);
            } catch {}
          }
        }
      }
    } catch (err) {
      if (!controller.signal.aborted) console.error("SSE error:", err);
    }
  })();

  return () => controller.abort();
}
