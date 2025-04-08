import "./strip.css";
import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function Strip(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "strip",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
