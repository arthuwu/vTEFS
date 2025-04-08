import { useDroppable } from "@dnd-kit/core";
import Strip from "./strip";
import "./bay.css";
import { Bay as BayData, StripData } from "./types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type BayProps = {
  bay: BayData;
  strips: StripData[];
};

export default function Bay({ bay, strips }: BayProps) {
  const { setNodeRef } = useDroppable({
    id: bay.id,
  });

  return (
    <SortableContext
      id={bay.id}
      items={strips}
      strategy={verticalListSortingStrategy}
    >
      <div className="bay-container">
        <div className="bay-title">{bay.title}</div>
        <div ref={setNodeRef} className="bay-drop-area">
          {strips.map((strip) => {
            return <Strip key={strip.id} stripData={strip} />;
          })}
        </div>
      </div>
    </SortableContext>
  );
}
