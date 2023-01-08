import { FC } from "react";

import { LayoutInstance } from "../types";

interface LayoutProps {
  layout: LayoutInstance;
  onDelete: (id: number) => void;
  onEdit: (layout: LayoutInstance) => void;
  onSelect: (id: number) => void;
  onDeselect: () => void;
  selected: boolean;
}
export const Layout: FC<LayoutProps> = ({
  layout,
  onSelect,
  onDeselect,
  onEdit,
  onDelete,
  selected,
}) => {
  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        marginBottom: "5px",
        backgroundColor: selected ? "grey" : "white",
      }}
    >
      <div>{layout.name || `Layout ${layout.id}`}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "5px",
        }}
      >
        <button onClick={() => (selected ? onDeselect() : onSelect(layout.id))}>
          {selected ? "Unselect" : "Select"}
        </button>
        <button onClick={() => onDelete(layout.id)}>Delete</button>
      </div>
    </div>
  );
};
