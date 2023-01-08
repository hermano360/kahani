export type RectInstance = {
  id: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  color: [number, number, number];
};

export type CanvasHandlers = {
  handleDoubleClick: CanvasHandler;
  handleDownClick: CanvasHandler;
  handleUpClick: CanvasHandler;
  handleMouseMove: CanvasHandler;
};

export type CanvasHandler = (x: number, y: number) => void;
