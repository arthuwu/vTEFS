import "./index.css";
import "./strip.css";
import { StripData } from "./types";
import { useSortable } from "@dnd-kit/sortable";

type StripProps = {
  stripData: StripData;
};

export default function Strip({ stripData }: StripProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: stripData.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} className="strip-container" style={style}>
      <div {...listeners} {...attributes} className="strip-callsign">
        {stripData.id}
      </div>
      <div className="strip-data">{stripData.data}</div>
    </div>
  );
}
