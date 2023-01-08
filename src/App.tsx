import { useState } from "react";
import { Canvas, Layouts } from "./components";
import { RectInstance } from "./types";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CLICK_TOLERANCE_WIDTH,
  STANDARD_RECT_SIZE,
} from "./utilities/constants";

const identifyRectangleSide = (
  rectangle: RectInstance,
  x: number,
  y: number
): ResizeSides[] => {
  const sides = [];
  if (isAboveEdge(rectangle.x1, x)) {
    sides.push("left" as ResizeSides);
  }
  if (isAboveEdge(rectangle.x2, x)) {
    sides.push("right" as ResizeSides);
  }
  if (isAboveEdge(rectangle.y1, y)) {
    sides.push("top" as ResizeSides);
  }
  if (isAboveEdge(rectangle.y2, y)) {
    sides.push("bottom" as ResizeSides);
  }

  return sides as ResizeSides[];
};

const handleRectangleMove = (
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

const handleRectangleResize = (
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

const findRectangleById = (
  id: number,
  rectangles: RectInstance[]
): RectInstance | undefined => {
  return rectangles.find((rectangle) => rectangle.id === id);
};

const removeRectangleById = (
  id: number,
  rectangles: RectInstance[]
): RectInstance[] => {
  return rectangles.filter((rectangle) => rectangle.id !== id);
};

const generateNewRectangle = (x: number, y: number): RectInstance => {
  return {
    id: Date.now(),
    x1: x - STANDARD_RECT_SIZE / 2,
    x2: x + STANDARD_RECT_SIZE / 2,
    y1: y - STANDARD_RECT_SIZE / 2,
    y2: y + STANDARD_RECT_SIZE / 2,
    color: [Math.random() * 255, Math.random() * 255, Math.random() * 255],
  };
};

const isAboveRectangleArea = (
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

const isAboveEdge = (border: number, dimension: number) => {
  return (
    dimension > border - CLICK_TOLERANCE_WIDTH &&
    dimension < border + CLICK_TOLERANCE_WIDTH
  );
};

const isAboveRectangleEdge = (
  x: number,
  y: number,
  rectangles: RectInstance[]
): number => {
  const id = rectangles.reduce((acc, el) => {
    if (acc) return acc;

    if (
      isAboveEdge(el.x1, x) ||
      isAboveEdge(el.x2, x) ||
      isAboveEdge(el.y1, y) ||
      isAboveEdge(el.y2, y)
    ) {
      return el.id;
    } else {
      return acc;
    }
  }, 0);

  return id;
};

type ResizeSides = "top" | "left" | "right" | "bottom";

function App() {
  const [rectangles, setRectangles] = useState<RectInstance[]>([]);
  const [isAboveArea, setIsAboveArea] = useState(0);
  const [isAboveEdge, setIsAboveEdge] = useState(0);
  const [currentRectangle, setCurrentRectangle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingSide, setIsResizingSide] = useState<ResizeSides[]>([]);
  const [currentResizing, setCurrentResizing] = useState<ResizeSides[]>([]);
  const [startingDrag, setStartingDrag] = useState([0, 0]);

  const handleDownClick = (x: number, y: number) => {
    if (isAboveArea) {
      setIsDragging(true);
      setCurrentRectangle(isAboveArea);
      setStartingDrag([x, y]);
    } else if (isAboveEdge) {
      setCurrentResizing(isResizingSide);
      setIsResizingSide([]);
      setCurrentRectangle(isAboveEdge);
    }
  };

  const handleDoubleClick = (x: number, y: number) => {
    const selectedId = isAboveArea || isAboveEdge;

    if (selectedId) {
      setRectangles(removeRectangleById(selectedId, rectangles));
    } else {
      setRectangles([...rectangles, generateNewRectangle(x, y)]);
    }
  };
  const handleUpClick = (x: number, y: number) => {
    const rectangle = findRectangleById(currentRectangle, rectangles);
    let newRectangle = rectangle;

    if (!rectangle) return;

    if (isDragging) {
      setIsDragging(false);

      const diffX = startingDrag[0] - x;
      const diffY = startingDrag[1] - y;

      newRectangle = handleRectangleMove(diffX, diffY, rectangle);
    } else if (currentResizing.length > 0) {
      newRectangle = handleRectangleResize(x, y, rectangle, currentResizing);

      setCurrentResizing([]);
    }

    const newRectangles = rectangles
      .filter((a) => a)
      .map((rect) => {
        return rect.id === currentRectangle ? newRectangle : rectangle;
      }) as RectInstance[];

    setRectangles(newRectangles);
    setCurrentRectangle(0);
  };

  const handleMouseMove = (x: number, y: number) => {
    const aboveRectangleArea = isAboveRectangleArea(x, y, rectangles);
    const aboveRectangleEdge = isAboveRectangleEdge(x, y, rectangles);
    setIsAboveArea(aboveRectangleArea);
    setIsAboveEdge(aboveRectangleEdge);

    if (aboveRectangleEdge) {
      const rectangle = findRectangleById(aboveRectangleEdge, rectangles);
      if (!rectangle) return;

      const side = identifyRectangleSide(rectangle, x, y);

      setIsResizingSide(side);
    } else {
      setIsResizingSide([]);
    }
  };

  const cursor = isAboveArea ? "grab" : isAboveEdge ? "crosshair" : "auto";

  return (
    <div style={{ cursor }}>
      <Canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        rectangles={rectangles}
        handlers={{
          handleDownClick,
          handleDoubleClick,
          handleUpClick,
          handleMouseMove,
        }}
      />
      {isAboveEdge}
      <Layouts />
    </div>
  );
}

export default App;
