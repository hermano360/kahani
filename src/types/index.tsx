export type RectInstance = {
  id: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  color: [number, number, number];
};

export type CanvasHandlers = {
  handleDoubleClick: (x: number, y: number) => void;
  handleDownClick: (x: number, y: number) => void;
  handleUpClick: (x: number, y: number) => void;
  handleMouseMove: (x: number, y: number) => void;
};
