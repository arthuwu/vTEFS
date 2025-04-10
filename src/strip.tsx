import "./index.css";
import "./strip.css";
import { StripData } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { useCallback, useRef } from "react";

type StripProps = {
  stripData: StripData;
  handleClick: () => void;
};

export default function Strip({ stripData, handleClick }: StripProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging, over } =
    useSortable({
      id: stripData.id,
    });

  const stripRef = useRef<HTMLDivElement>(null);

  const refs = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      stripRef.current = node;
    },
    [setNodeRef]
  );

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  function toggleIndent() {
    if (stripRef.current) {
      stripRef.current.classList.toggle("indented");
    }
  }

  if (isDragging) {
    if (over) {
      if (["ARR", "GMCAG"].includes(over!.id as string)) {
        return (
          <div className="dragging-preview-half">
            <div className="left-arrow"></div>
            <div className="middle-bar"></div>
            <div className="right-arrow"></div>
          </div>
        );
      } else {
        return (
          <div className="dragging-preview-full">
            <div className="left-arrow"></div>
            <div className="middle-bar"></div>
            <div className="right-arrow"></div>
          </div>
        );
      }
    }
  }

  return stripData.size === "full" ? (
    <div
      ref={refs}
      className="strip-container"
      style={style}
      onClick={handleClick}
    >
      <div {...listeners} {...attributes} className="strip-callsign">
        {stripData["fpdata"].cs}
      </div>
      <div className="strip-data">{stripData["fpdata"].a_rmk}</div>
      <button className="strip-toggle-indent" onClick={toggleIndent} />
    </div>
  ) : (
    <div
      ref={refs}
      className="strip-container-partial"
      style={style}
      onClick={handleClick}
    >
      <div {...listeners} {...attributes} className="strip-callsign">
        {stripData["fpdata"].cs}
      </div>
      <div className="strip-data">{stripData["fpdata"].a_rmk}</div>
    </div>
  );
}
