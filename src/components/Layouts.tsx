import { FC, useEffect, useState } from "react";
import { LayoutInstance, RectInstance } from "../types";
import {
  getCurrentLayout,
  getCurrentRectangles,
  getSavedLayoutList,
} from "../utilities/utils";
import { Layout } from "./Layout";

interface LayoutsProps {
  rectangles: RectInstance[];
  setRectangles: (rectangles: RectInstance[]) => void;
}

const findLayoutById = (
  id: number,
  layoutList: LayoutInstance[]
): LayoutInstance | undefined => {
  return layoutList.find((layout) => layout.id === id);
};

export const Layouts: FC<LayoutsProps> = ({ rectangles, setRectangles }) => {
  const [layoutList, setLayoutList] = useState<LayoutInstance[]>([]);

  const setCurrentLayout = (layout?: LayoutInstance) => {
    if (!layout) {
      setRectangles([]);
      localStorage.setItem("currentLayout", "");
    } else {
      setRectangles(layout.rectangles);
      localStorage.setItem("currentLayout", layout.id.toString());
    }
  };

  const setLayouts = (layoutList: LayoutInstance[]) => {
    setLayoutList(layoutList);
    localStorage.setItem("layouts", JSON.stringify(layoutList));
  };

  const saveLayout = () => {
    const currentLayout = getCurrentLayout();

    if (currentLayout) {
      setLayouts(
        layoutList.map((layout) => {
          if (layout.id === currentLayout) {
            return {
              ...layout,
              rectangles,
            };
          } else {
            return layout;
          }
        })
      );
    } else {
      const newLayout = { id: Date.now(), name: "", rectangles };
      setCurrentLayout(newLayout);
      setLayouts([newLayout, ...layoutList]);
    }
  };

  const deleteLayout = (id: number) => {
    const newLayouts = layoutList.filter((layout) => layout.id !== id);
    setCurrentLayout(undefined);
    setLayouts(newLayouts);
  };

  const editLayout = (layout: LayoutInstance) => {
    const newLayouts = layoutList.map((layoutItem) => {
      return layoutItem.id === layout.id ? layout : layoutItem;
    });
    setLayouts(newLayouts);
  };

  const selectLayout = (id: number) => {
    const layout = findLayoutById(id, layoutList);
    if (!layout) return;
    setCurrentLayout(layout);
  };
  const deselectLayout = () => {
    setCurrentLayout(undefined);
  };
  const selectedLayout = getCurrentLayout();

  useEffect(() => {
    const savedLayoutList = getSavedLayoutList();
    const currentLayout = getCurrentLayout();
    const savedRectangles = getCurrentRectangles();
    setLayoutList(savedLayoutList);

    if (currentLayout) {
      const layoutInstance = findLayoutById(currentLayout, savedLayoutList);
      if (!layoutInstance) return;

      const currentRectangles = layoutInstance.rectangles;

      setRectangles(currentRectangles);
    } else if (savedRectangles.length > 0) {
      setRectangles(savedRectangles);
    }
  }, [setRectangles]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      Layouts
      <button onClick={saveLayout} style={{ marginBottom: "5px" }}>
        Save {selectedLayout ? "Current" : "New"} Layout
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {layoutList.map((layout) => {
          return (
            <Layout
              key={layout.id}
              layout={layout}
              selected={selectedLayout === layout.id}
              onDelete={deleteLayout}
              onEdit={editLayout}
              onSelect={selectLayout}
              onDeselect={deselectLayout}
            />
          );
        })}
      </div>
    </div>
  );
};
