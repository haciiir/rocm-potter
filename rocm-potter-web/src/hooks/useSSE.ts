import { useEffect, useRef, useCallback } from "react";
import { useOpencode } from "./useOpencode";
import { subscribeSSE, type SSEEventHandler } from "../lib/sse";

export function useSSE(onEvent: SSEEventHandler) {
  const { client, baseUrl } = useOpencode();
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  const stableHandler = useCallback<SSEEventHandler>((event) => {
    handlerRef.current(event);
  }, []);

  useEffect(() => {
    if (!client || !baseUrl) return;
    const unsubscribe = subscribeSSE(baseUrl, stableHandler);
    return unsubscribe;
  }, [client, baseUrl, stableHandler]);
}
