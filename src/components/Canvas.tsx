import { FC } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { RectInstance, CanvasHandlers } from "../utilities/types";

interface CanvasProps {
  height: number;
  width: number;
  rectangles: RectInstance[];
  handlers: CanvasHandlers;
}

export const Canvas: FC<CanvasProps> = ({
  width,
  height,
  rectangles,
  handlers,
}) => {
  const { canvasRef } = useCanvas(rectangles, handlers);

  return <canvas ref={canvasRef} id="canvas" width={width} height={height} />;
};
