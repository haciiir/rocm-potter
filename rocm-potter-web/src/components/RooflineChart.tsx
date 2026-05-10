import { useEffect, useRef, useCallback } from "react";
import { MI300X_PEAKS } from "../types";

interface Props {
  achievedGflops?: number;
  achievedAI?: number;
}

const LOG_MIN = -1;
const LOG_MAX = 3;
const PADDING = { top: 20, right: 60, bottom: 36, left: 56 };

function logX(ai: number): number {
  return Math.log10(ai);
}

function toCanvasX(logVal: number, w: number): number {
  const frac = (logVal - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return PADDING.left + frac * (w - PADDING.left - PADDING.right);
}

function toCanvasY(gflops: number, h: number, logMinY: number, logMaxY: number): number {
  const frac = (logMaxY - Math.log10(gflops)) / (logMaxY - logMinY);
  return PADDING.top + frac * (h - PADDING.top - PADDING.bottom);
}

export default function RooflineChart({ achievedGflops, achievedAI }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    const logMinY = 1;
    const logMaxY = 6.2;

    const plotW = w - PADDING.left - PADDING.right;
    const plotH = h - PADDING.top - PADDING.bottom;

    ctx.strokeStyle = "#1f1d1c";
    ctx.lineWidth = 1;
    for (let lv = LOG_MIN; lv <= LOG_MAX; lv++) {
      const x = toCanvasX(lv, w);
      ctx.beginPath();
      ctx.moveTo(x, PADDING.top);
      ctx.lineTo(x, h - PADDING.bottom);
      ctx.stroke();
    }
    for (let ly = logMinY; ly <= logMaxY; ly++) {
      const y = toCanvasY(Math.pow(10, ly), h, logMinY, logMaxY);
      ctx.beginPath();
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(w - PADDING.right, y);
      ctx.stroke();
    }

    ctx.fillStyle = "#5c5855";
    ctx.font = "10px Geist Mono, monospace";
    ctx.textAlign = "center";
    for (let lv = LOG_MIN; lv <= LOG_MAX; lv++) {
      const x = toCanvasX(lv, w);
      ctx.fillText(Math.pow(10, lv).toString(), x, h - PADDING.bottom + 14);
    }
    ctx.fillText("Arithmetic Intensity (OP/B)", PADDING.left + plotW / 2, h - 4);

    ctx.textAlign = "right";
    for (let ly = logMinY; ly <= logMaxY; ly++) {
      const y = toCanvasY(Math.pow(10, ly), h, logMinY, logMaxY);
      ctx.fillText(`1e${ly}`, PADDING.left - 6, y + 3);
    }
    ctx.save();
    ctx.translate(10, PADDING.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("GFLOP/s", 0, 0);
    ctx.restore();

    const bwGbps = MI300X_PEAKS.BW_GBPS;
    const fp32Peak = MI300X_PEAKS.FP32_GFLOPS;
    const tf32Peak = MI300X_PEAKS.TF32_GFLOPS;
    const fp16Peak = MI300X_PEAKS.FP16_GFLOPS;
    const ridgeFP32 = MI300X_PEAKS.RIDGE_AI_FP32;
    const ridgeTF32 = MI300X_PEAKS.RIDGE_AI_TF32;
    const ridgeFP16 = MI300X_PEAKS.RIDGE_AI_FP16;

    ctx.lineWidth = 1.5;

    ctx.strokeStyle = "#fb923c";
    ctx.beginPath();
    const bwStartAI = Math.pow(10, LOG_MIN);
    const bwStartGflops = bwStartAI * bwGbps;
    ctx.moveTo(
      toCanvasX(logX(bwStartAI), w),
      toCanvasY(bwStartGflops, h, logMinY, logMaxY),
    );
    ctx.lineTo(
      toCanvasX(logX(ridgeFP32), w),
      toCanvasY(fp32Peak, h, logMinY, logMaxY),
    );
    ctx.stroke();

    const drawPeakLine = (peak: number, ridgeAI: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      const x1 = toCanvasX(logX(ridgeAI), w);
      const x2 = toCanvasX(LOG_MAX, w);
      const y = toCanvasY(peak, h, logMinY, logMaxY);
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = "10px Geist Mono, monospace";
      ctx.textAlign = "left";
      ctx.fillText(label, x2 + 4, y + 3);
    };

    drawPeakLine(fp32Peak, ridgeFP32, "#38bdf8", "FP32");
    drawPeakLine(tf32Peak, ridgeTF32, "#c084fc", "TF32");
    drawPeakLine(fp16Peak, ridgeFP16, "#e879f9", "FP16");

    const drawRidgeMarker = (ridgeAI: number) => {
      const x = toCanvasX(logX(ridgeAI), w);
      const y = toCanvasY(ridgeAI * bwGbps, h, logMinY, logMaxY);
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    drawRidgeMarker(ridgeFP32);
    drawRidgeMarker(ridgeTF32);
    drawRidgeMarker(ridgeFP16);

    if (achievedGflops != null && achievedAI != null && achievedAI > 0) {
      const kx = toCanvasX(logX(achievedAI), w);
      const ky = toCanvasY(achievedGflops, h, logMinY, logMaxY);

      ctx.shadowColor = "#e46a2c";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#e46a2c";
      ctx.beginPath();
      ctx.arc(kx, ky, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(kx, ky, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [achievedGflops, achievedAI]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    draw();

    const ro = new ResizeObserver(() => {
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
