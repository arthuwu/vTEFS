import { useState } from "react";
import Bay from "./bay";
import "./index.css";
import { Bay as BayData, StripData } from "./types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

const BAYS: BayData[] = [
  { id: "RDY", title: "Ready To Start" },
  { id: "PUSH", title: "Pushback" },
  { id: "TAXI", title: "Taxi" },
];

const INITIAL_STRIPS: StripData[] = [
  {
    id: "CPA123",
    bay: "RDY",
    data: "hello world",
  },
  {
    id: "CPA1234",
    bay: "RDY",
    data: "hello world",
  },
  {
    id: "CPA1235",
    bay: "RDY",
    data: "hello world",
  },
  {
    id: "CPA2234",
    bay: "RDY",
    data: "hello world",
  },
];

export default function App() {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [strips, setStrips] = useState<StripData[]>(INITIAL_STRIPS);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const stripId = active.id as string;
    const newBay = over.id as StripData["bay"];
    console.log(over.id);

    setStrips(() =>
      strips.map((strip: StripData) =>
        strip.id === stripId
          ? {
              ...strip,
              bay: newBay,
            }
          : strip
      )
    );
  }

  return (
    <div className="layout-page">
      <div className="layout-container">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {BAYS.map((bay) => {
            return (
              <Bay
                key={bay.id}
                bay={bay}
                strips={strips.filter((strip) => strip.bay === bay.id)}
              />
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}
