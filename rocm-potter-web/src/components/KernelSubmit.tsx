import { useState } from "react";
import { useOpencode } from "../hooks/useOpencode";

interface Props {
  onSessionCreated: (sessionId: string) => void;
}

export default function KernelSubmit({ onSessionCreated }: Props) {
  const [kernelName, setKernelName] = useState("");
  const [kernelSource, setKernelSource] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { client } = useOpencode();

  async function handleSubmit() {
    if (!client || !kernelSource.trim()) return;
    setSubmitting(true);
    try {
      const name = kernelName.trim() || "unnamed_kernel";
      const createRes = await client.session.create({ body: { title: name } });
      const sessionId = (createRes.data as { id?: string })?.id;
      if (!sessionId) throw new Error("No session ID");
      await client.session.prompt({
        path: { id: sessionId },
        body: {
          parts: [{ type: "text", text: `Port this CUDA kernel to HIP for AMD MI300X:\n\n\`\`\`cuda\n${kernelSource}\n\`\`\`` }],
          agent: "potter",
        },
      });
      onSessionCreated(sessionId);
    } catch (err) {
      console.error("Failed to submit kernel:", err);
      alert("Failed to start porting session");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-text">Port a CUDA Kernel</h2>
      <div className="w-full">
        <label className="block text-xs text-text-muted mb-1">Kernel Name</label>
        <input type="text" value={kernelName} onChange={(e) => setKernelName(e.target.value)} placeholder="e.g. matmul_1x1" className="w-full bg-bg border border-border-subtle rounded px-3 py-2 text-sm font-mono text-text focus:outline-none focus:border-primary" />
      </div>
      <div className="w-full flex-1">
        <label className="block text-xs text-text-muted mb-1">CUDA Source Code</label>
        <textarea value={kernelSource} onChange={(e) => setKernelSource(e.target.value)} placeholder="Paste CUDA kernel source here..." className="w-full h-64 bg-bg border border-border-subtle rounded px-3 py-2 text-sm font-mono text-text focus:outline-none focus:border-primary resize-none" />
      </div>
      <button onClick={handleSubmit} disabled={submitting || !kernelSource.trim()} className="bg-primary text-bg px-6 py-2 rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50">
        {submitting ? "Starting..." : "Start Porting"}
      </button>
    </div>
  );
}
