import { useEffect, useState } from "react";
import { useFileContent } from "../hooks/useFileContent";
import { createHighlighter, type Highlighter } from "shiki";

const LANG_MAP: Record<string, string> = {
  ".cu": "cuda-cpp",
  ".hip": "cpp",
  ".cpp": "cpp",
  ".h": "cpp",
  ".hpp": "cpp",
  ".c": "c",
  ".py": "python",
  ".md": "markdown",
  ".json": "json",
  ".cmake": "cmake",
  ".txt": "plaintext",
  ".yaml": "yaml",
  ".yml": "yaml",
};

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["one-dark-pro"],
      langs: ["cpp", "c", "python", "json", "markdown", "yaml", "cmake"],
    });
  }
  return highlighterPromise;
}

function langFromPath(path: string): string {
  const dot = path.lastIndexOf(".");
  if (dot === -1) return "plaintext";
  const ext = path.substring(dot);
  return LANG_MAP[ext] ?? "plaintext";
}

interface Props {
  path: string | null;
}

export default function CodeViewer({ path }: Props) {
  const { content, loading } = useFileContent(path);
  const [highlighted, setHighlighted] = useState<string>("");

  useEffect(() => {
    if (!content || !path) { setHighlighted(""); return; }
    const lang = langFromPath(path);
    getHighlighter().then((hl) => {
      try {
        const html = hl.codeToHtml(content, { lang, theme: "one-dark-pro" });
        setHighlighted(html);
      } catch {
        try {
          const html = hl.codeToHtml(content, { lang: "plaintext", theme: "one-dark-pro" });
          setHighlighted(html);
        } catch { setHighlighted(""); }
      }
    });
  }, [content, path]);

  if (!path) return <div className="flex-1 flex items-center justify-center text-text-muted text-sm bg-bg">Select a file to view</div>;
  if (loading) return <div className="flex-1 flex items-center justify-center text-text-muted text-sm bg-bg">Loading...</div>;

  return (
    <div className="flex-1 overflow-auto bg-[#282c34] rounded-sm flex flex-col">
      <div className="px-3 py-1.5 text-xs font-mono text-text-muted border-b border-border bg-bg-card shrink-0">
        {path.split("/").pop()}
      </div>
      {highlighted ? (
        <div
          className="shiki-container text-sm font-mono [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-4 [&_code]:!font-mono [&_code]:!text-[13px] [&_code]:!leading-[1.6] flex-1 overflow-auto"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <pre className="p-4 text-sm font-mono text-text whitespace-pre-wrap flex-1 overflow-auto">{content}</pre>
      )}
    </div>
  );
}
