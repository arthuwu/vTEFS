import { useDroppable } from "@dnd-kit/core";
import Strip from "./strip";
import "./bay.css";
import { Bay as BayData, StripData } from "./types";

type BayProps = {
  bay: BayData;
  strips: StripData[];
};

export default function Bay({ bay, strips }: BayProps) {
  const { setNodeRef } = useDroppable({
    id: bay.id,
  });

  return (
    <div className="bay-container">
      <div className="bay-title">{bay.title}</div>
      <div ref={setNodeRef} className="bay-drop-area">
        {strips.map((strip) => {
          return <Strip key={strip.id} stripData={strip} />;
        })}
      </div>
    </div>
  );
}
