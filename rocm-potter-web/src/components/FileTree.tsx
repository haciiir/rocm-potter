import { useCallback } from "react";
import { useFileTree } from "../hooks/useFileTree";
import FileTreeNode from "./FileTreeNode";

interface Props {
  basePath: string | null;
  onSelectFile: (path: string) => void;
}

export default function FileTree({ basePath, onSelectFile }: Props) {
  const { nodes, expanded, selectedPath, loadDir, toggleExpand, selectFile } = useFileTree(basePath);

  const handleSelect = useCallback(
    (path: string) => {
      selectFile(path);
      onSelectFile(path);
    },
    [selectFile, onSelectFile],
  );

  return (
    <div className="w-[220px] shrink-0 border-r border-border bg-bg-card overflow-y-auto">
      <div className="px-2 py-2 text-[10px] uppercase tracking-wider text-text-muted font-semibold border-b border-border">
        Files
      </div>
      <div className="py-1">
        {nodes.map((node) => (
          <FileTreeNode key={node.path} node={node} depth={0} selectedPath={selectedPath} expanded={expanded} onSelect={handleSelect} onToggle={toggleExpand} loadChildren={loadDir} />
        ))}
        {nodes.length === 0 && <div className="px-3 py-2 text-text-muted text-xs">No files</div>}
      </div>
    </div>
  );
}
