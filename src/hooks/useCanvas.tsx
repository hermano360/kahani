import { useEffect, useRef } from "react";

const drawBorder = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, 500, 500);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.rect(0, 0, 500, 500);
  ctx.stroke();
};

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownClick = () => {};
  const handleDoubleClick = () => {};
  const handleUpClick = () => {};
  const handleMouseMove = () => {};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.onmousedown = handleDownClick;
    canvas.onmouseup = handleUpClick;
    canvas.ondblclick = handleDoubleClick;
    canvas.onmousemove = handleMouseMove;

    drawBorder(context);
  }, []);

  return { canvasRef };
};
