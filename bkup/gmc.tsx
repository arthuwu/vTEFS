import React, { useState } from "react";
import "./index.css";
import { DndContext } from "@dnd-kit/core";
import { MouseSensor, TouchSensor, useSensor } from "@dnd-kit/core";

import Bay from "./bay";
import Strip from "./strip";

export default function GMC() {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = <Strip>Drag me</Strip>;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!isDropped ? draggableMarkup : null}
      <Bay>{isDropped ? draggableMarkup : "Drop here"}</Bay>
    </DndContext>
  );

  function handleDragEnd(event) {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  }
}
