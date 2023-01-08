import { useEffect, useState } from "react";
import { Canvas, Layouts } from "./components";
import { RectInstance, ResizeSides } from "./types";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utilities/constants";
import {
  findRectangleById,
  generateNewRectangle,
  handleRectangleMove,
  handleRectangleResize,
  identifyRectangleSide,
  isAboveRectangleArea,
  isAboveRectangleEdge,
  removeRectangleById,
  updateRectangleColor,
} from "./utilities/utils";

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

  useEffect(() => {
    localStorage.setItem("rectangles", JSON.stringify(rectangles));
  }, [rectangles]);

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
      <Layouts rectangles={rectangles} setRectangles={setRectangles} />
    </div>
  );
}

export default App;
