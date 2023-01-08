import { FC, useState } from "react";

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
  const [layoutName, setLayoutName] = useState(layout.name);
  const [isRenaming, setIsRenaming] = useState(false);

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        marginBottom: "5px",
        backgroundColor: selected ? "grey" : "white",
        color: selected ? "white" : "black",
        width: '100%'
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {isRenaming ? (
          <>
            <input
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
            />
            <button
              onClick={() => {
                onEdit({ ...layout, name: layoutName });
                setIsRenaming(false);
              }}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <div style={{ marginRight: "5px" }}>
              {layout.name || `Layout ${layout.id}`}
            </div>
            <button onClick={() => setIsRenaming(true)}>Rename</button>
          </>
        )}
      </div>

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
