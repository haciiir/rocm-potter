import { useState, useCallback } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import type { FileNode } from "../hooks/useFileTree";

interface Props {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  expanded: Set<string>;
  onSelect: (path: string) => void;
  onToggle: (path: string) => void;
  loadChildren: (path: string) => Promise<FileNode[]>;
}

export default function FileTreeNode({ node, depth, selectedPath, expanded, onSelect, onToggle, loadChildren }: Props) {
  const [children, setChildren] = useState<FileNode[]>([]);
  const isDir = node.type === "directory";
  const isExpanded = expanded.has(node.path);
  const isSelected = selectedPath === node.path;

  const handleClick = useCallback(async () => {
    if (isDir) {
      if (!isExpanded && children.length === 0) {
        const loaded = await loadChildren(node.path);
        setChildren(loaded);
      }
      onToggle(node.path);
    } else {
      onSelect(node.path);
    }
  }, [isDir, isExpanded, children.length, node.path, loadChildren, onToggle, onSelect]);

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-0.5 px-1 cursor-pointer hover:bg-bg-elevated text-xs font-mono ${isSelected ? "bg-bg-elevated text-primary" : "text-text-subtle"}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={handleClick}
      >
        {isDir ? (
          isExpanded ? <ChevronDown size={12} className="shrink-0 text-text-muted" /> : <ChevronRight size={12} className="shrink-0 text-text-muted" />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        {isDir ? (
          isExpanded ? <FolderOpen size={13} className="shrink-0 text-primary" /> : <Folder size={13} className="shrink-0 text-text-muted" />
        ) : (
          <File size={13} className="shrink-0 text-text-muted" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {isDir && isExpanded && (
        <div>
          {children.map((child) => (
            <FileTreeNode key={child.path} node={child} depth={depth + 1} selectedPath={selectedPath} expanded={expanded} onSelect={onSelect} onToggle={onToggle} loadChildren={loadChildren} />
          ))}
        </div>
      )}
    </div>
  );
}
