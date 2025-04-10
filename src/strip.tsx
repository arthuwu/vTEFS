import "./index.css";
import "./strip.css";
import { StripData } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { useCallback, useRef } from "react";

type StripProps = {
  stripData: StripData;
};

export default function Strip({ stripData }: StripProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
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

  return stripData.size === "full" ? (
    <div ref={refs} className="strip-container" style={style}>
      <div {...listeners} {...attributes} className="strip-callsign">
        {stripData["fpdata"].cs}
      </div>
      <div className="strip-data">{stripData["fpdata"].a_rmk}</div>
      <button className="strip-toggle-indent" onClick={toggleIndent} />
    </div>
  ) : (
    <div ref={refs} className="strip-container-partial" style={style}>
      <div {...listeners} {...attributes} className="strip-callsign">
        {stripData["fpdata"].cs}
      </div>
      <div className="strip-data">{stripData["fpdata"].a_rmk}</div>
    </div>
  );
}
