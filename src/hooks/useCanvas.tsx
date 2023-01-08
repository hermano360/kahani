import { useEffect, useRef } from "react";
import { RectInstance, CanvasHandlers } from "../types";

const drawBorder = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, 500, 500);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.rect(0, 0, 500, 500);
  ctx.stroke();
};

const drawRectangles = (
  ctx: CanvasRenderingContext2D,
  rectangles: RectInstance[]
) => {
  rectangles.forEach((rect) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
    ctx.fillStyle = `rgb(${rect.color[0]},${rect.color[1]},${rect.color[2]})`;
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.stroke();
  });
};

export const useCanvas = (
  rectangles: RectInstance[],
  {
    handleDoubleClick,
    handleDownClick,
    handleUpClick,
    handleMouseMove,
  }: CanvasHandlers
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.onmousedown = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;

      handleDownClick(x, y);
    };
    canvas.onmouseup = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;

      handleUpClick(x, y);
    };
    canvas.ondblclick = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      handleDoubleClick(x, y);
    };
    canvas.onmousemove = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      handleMouseMove(x, y);
    };

    drawBorder(context);
    drawRectangles(context, rectangles);
  }, [
    handleDoubleClick,
    handleDownClick,
    handleMouseMove,
    handleUpClick,
    rectangles,
  ]);

  return { canvasRef };
};
