import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import Bay from "./bay";
import "./index.css";
import { DndContext } from "@dnd-kit/core";
import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, } from "@dnd-kit/core";
const BAYS = [
    { id: "RDY", title: "Ready To Start" },
    { id: "PUSH", title: "Pushback" },
    { id: "TAXI", title: "Taxi" },
];
const INITIAL_STRIPS = [
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
    const [strips, setStrips] = useState(INITIAL_STRIPS);
    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over)
            return;
        const stripId = active.id;
        const newBay = over.id;
        console.log(over.id);
        setStrips(() => strips.map((strip) => strip.id === stripId
            ? Object.assign(Object.assign({}, strip), { bay: newBay }) : strip));
    }
    return (_jsx("div", { className: "layout-page", children: _jsx("div", { className: "layout-container", children: _jsx(DndContext, { sensors: sensors, onDragEnd: handleDragEnd, children: BAYS.map((bay) => {
                    return (_jsx(Bay, { bay: bay, strips: strips.filter((strip) => strip.bay === bay.id) }, bay.id));
                }) }) }) }));
}
