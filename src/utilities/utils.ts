import { CLICK_TOLERANCE_WIDTH, STANDARD_RECT_SIZE } from "./constants";
import { LayoutInstance, RectInstance, ResizeSides } from "../types";

export const updateRectangleColor = (
  selectedId: number,
  rectangles: RectInstance[]
): RectInstance[] => {
  const rectangle = findRectangleById(selectedId, rectangles);

  return rectangles.map((rect) => {
    return rect.id === selectedId && rectangle
      ? {
          ...rectangle,
          color: [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255,
          ],
        }
      : rect;
  });
};

export const identifyRectangleSide = (
  rectangle: RectInstance,
  x: number,
  y: number
): ResizeSides[] => {
  const sides = [];
  if (isMouseAboveEdge(rectangle.x1, x, rectangle.y1, rectangle.y2, y)) {
    sides.push("left" as ResizeSides);
  }
  if (isMouseAboveEdge(rectangle.x2, x, rectangle.y1, rectangle.y2, y)) {
    sides.push("right" as ResizeSides);
  }
  if (isMouseAboveEdge(rectangle.y1, y, rectangle.x1, rectangle.x2, x)) {
    sides.push("top" as ResizeSides);
  }
  if (isMouseAboveEdge(rectangle.y2, y, rectangle.x1, rectangle.x2, x)) {
    sides.push("bottom" as ResizeSides);
  }

  return sides as ResizeSides[];
};

export const handleRectangleMove = (
  diffX: number,
  diffY: number,
  rectangle: RectInstance
) => {
  return {
    ...rectangle,
    x1: rectangle.x1 - diffX,
    y1: rectangle.y1 - diffY,
    x2: rectangle.x2 - diffX,
    y2: rectangle.y2 - diffY,
  };
};

export const handleRectangleResize = (
  x: number,
  y: number,
  rectangle: RectInstance,
  side: ResizeSides[]
) => {
  let x1 = rectangle.x1;
  let x2 = rectangle.x2;
  let y1 = rectangle.y1;
  let y2 = rectangle.y2;

  if (side.includes("left")) {
    x1 = x;
  }
  if (side.includes("right")) {
    x2 = x;
  }
  if (side.includes("top")) {
    y1 = y;
  }
  if (side.includes("bottom")) {
    y2 = y;
  }

  return {
    ...rectangle,
    x1: x1 > x2 ? x2 : x1,
    x2: x2 > x1 ? x2 : x1,
    y1: y1 > y2 ? y2 : y1,
    y2: y2 > y1 ? y2 : y1,
  };
};

export const findRectangleById = (
  id: number,
  rectangles: RectInstance[]
): RectInstance | undefined => {
  return rectangles.find((rectangle) => rectangle.id === id);
};

export const removeRectangleById = (
  id: number,
  rectangles: RectInstance[]
): RectInstance[] => {
  return rectangles.filter((rectangle) => rectangle.id !== id);
};

export const generateNewRectangle = (x: number, y: number): RectInstance => {
  return {
    id: Date.now(),
    x1: x - STANDARD_RECT_SIZE / 2,
    x2: x + STANDARD_RECT_SIZE / 2,
    y1: y - STANDARD_RECT_SIZE / 2,
    y2: y + STANDARD_RECT_SIZE / 2,
    color: [Math.random() * 255, Math.random() * 255, Math.random() * 255],
  };
};

export const isAboveRectangleArea = (
  x: number,
  y: number,
  rectangles: RectInstance[]
): number => {
  const id = rectangles.reduce((acc, el) => {
    if (acc) return acc;

    if (
      x >= el.x1 + CLICK_TOLERANCE_WIDTH &&
      x <= el.x2 - CLICK_TOLERANCE_WIDTH &&
      y >= el.y1 + CLICK_TOLERANCE_WIDTH &&
      y <= el.y2 - CLICK_TOLERANCE_WIDTH
    ) {
      return el.id;
    } else {
      return acc;
    }
  }, 0);

  return id;
};

export const isMouseAboveEdge = (
  border: number,
  dimension: number,
  lowLimit: number,
  highLimit: number,
  otherDimension: number
) => {
  return (
    dimension > border - CLICK_TOLERANCE_WIDTH &&
    dimension < border + CLICK_TOLERANCE_WIDTH &&
    otherDimension > lowLimit - CLICK_TOLERANCE_WIDTH &&
    otherDimension < highLimit + CLICK_TOLERANCE_WIDTH
  );
};

export const isAboveRectangleEdge = (
  x: number,
  y: number,
  rectangles: RectInstance[]
): number => {
  const id = rectangles.reduce((acc, el) => {
    if (acc) return acc;

    if (
      isMouseAboveEdge(el.x1, x, el.y1, el.y2, y) ||
      isMouseAboveEdge(el.x2, x, el.y1, el.y2, y) ||
      isMouseAboveEdge(el.y1, y, el.x1, el.x2, x) ||
      isMouseAboveEdge(el.y2, y, el.x1, el.x2, x)
    ) {
      return el.id;
    } else {
      return acc;
    }
  }, 0);

  return id;
};

export const getSavedLayoutList = (): LayoutInstance[] => {
  const layoutListString = localStorage.getItem("layouts");
  const layoutList: LayoutInstance[] = layoutListString
    ? JSON.parse(layoutListString)
    : [];
  return layoutList;
};

export const getCurrentLayout = () => {
  const currentLayoutString = localStorage.getItem("currentLayout");
  return currentLayoutString ? Number(currentLayoutString) : "";
};

export const getCurrentRectangles = () => {
  const currentRectangleString = localStorage.getItem("rectangles");
  return currentRectangleString ? JSON.parse(currentRectangleString) : [];
};
