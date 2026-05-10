import { createOpencodeClient, type OpencodeClient } from "@opencode-ai/sdk";

export type { OpencodeClient };
export { createOpencodeClient };

export function createClient(baseUrl: string): OpencodeClient {
  return createOpencodeClient({ baseUrl });
}
