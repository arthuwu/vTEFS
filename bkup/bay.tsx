import "./bay.css";
import { useDroppable } from "@dnd-kit/core";

export default function Bay(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: "bay",
  });

  return (
    <div className="bay" ref={setNodeRef}>
      {props.children}
    </div>
  );
}
