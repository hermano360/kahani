import { useState } from "react";
import { Canvas, Layouts } from "./components";
import { RectInstance } from "./types";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CLICK_TOLERANCE_WIDTH,
  STANDARD_RECT_SIZE,
} from "./utilities/constants";

const updateRectangleColor = (
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

const identifyRectangleSide = (
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

const isMouseAboveEdge = (
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

const isAboveRectangleEdge = (
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

    if (isAboveArea) {
      setRectangles(removeRectangleById(selectedId, rectangles));
    } else if (isAboveEdge) {
      setRectangles(updateRectangleColor(selectedId, rectangles));
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
      .map((rect) =>
        rect.id === currentRectangle ? newRectangle : rect
      ) as RectInstance[];

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
      <Layouts />
    </div>
  );
}

export default App;
