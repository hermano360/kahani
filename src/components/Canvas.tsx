import { useCanvas } from "../hooks/useCanvas";

export const Canvas = () => {
  const { canvasRef } = useCanvas();

  return <canvas ref={canvasRef} id="canvas" width="500" height="500" />;
};
