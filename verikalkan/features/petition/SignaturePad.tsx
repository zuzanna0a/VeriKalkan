"use client";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

export interface SignaturePadRef {
  isEmpty: () => boolean;
  toDataURL: () => string;
  clear: () => void;
}

const SignaturePad = forwardRef<SignaturePadRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const isEmpty = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      isEmpty.current = false;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const end = () => { isDrawing.current = false; };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", end);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    isEmpty: () => isEmpty.current,
    toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      isEmpty.current = true;
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={150}
      style={{ border: "1px solid #1a2a3a", borderRadius: "8px", width: "100%", height: "150px", background: "white", touchAction: "none" }}
    />
  );
});

SignaturePad.displayName = "SignaturePad";
export default SignaturePad;
