import { useDroppable } from "@dnd-kit/core";
import Strip from "./strip";
import "./bay.css";
import { Bay as BayData, StripData } from "./types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { windowProps } from "./layout";

type BayProps = {
  bay: BayData;
  strips: StripData[];
  handleStripClick: ({ stripId }: { stripId: string }) => void;
  windowProps: windowProps;
  drawingProps: any;
};

export default function Bay({
  bay,
  strips,
  handleStripClick,
  windowProps,
  drawingProps,
}: BayProps) {
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
        <div className="bay-drop-container">
          <div className="bay-image-overlay"></div>
          <div ref={setNodeRef} className="bay-drop-area">
            <div className="bay-image-overlay"></div>
            {strips.map((strip) => {
              return (
                <Strip
                  key={strip.id}
                  stripData={strip}
                  handleClick={() => handleStripClick({ stripId: strip.id })}
                  windowProps={windowProps}
                  drawingProps={drawingProps}
                />
              );
            })}
          </div>
        </div>
      </div>
    </SortableContext>
  );
}
