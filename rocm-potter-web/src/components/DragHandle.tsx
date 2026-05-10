import { useCallback, useRef } from "react";

interface Props {
  onDrag: (deltaY: number) => void;
  onExpand: () => void;
  isExpanded: boolean;
}

export default function DragHandle({ onDrag, onExpand, isExpanded }: Props) {
  const dragging = useRef(false);
  const lastY = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastY.current = e.clientY;
    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = ev.clientY - lastY.current;
      lastY.current = ev.clientY;
      onDrag(delta);
    };
    const handleMouseUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [onDrag]);

  return (
    <div className="h-2 flex items-center justify-center cursor-row-resize hover:bg-bg-elevated border-y border-border select-none group" onMouseDown={handleMouseDown}>
      <div className="flex items-center gap-1">
        <div className="w-8 h-0.5 bg-border-subtle rounded group-hover:bg-text-muted" />
        <button className="text-[10px] text-text-muted hover:text-primary ml-1" onClick={(e) => { e.stopPropagation(); onExpand(); }}>
          {isExpanded ? "⤓" : "⤢"}
        </button>
      </div>
    </div>
  );
}
