import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Bay from "./bay";
import Strip from "./strip";
import "./index.css";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, closestCorners, DragOverlay, } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
const INITIAL_STRIPS = [
    {
        id: "CPA123",
        data: "hello world",
    },
    {
        id: "CPA1234",
        data: "hello world",
    },
    {
        id: "CPA1235",
        data: "hello world",
    },
    {
        id: "CPA2234",
        data: "hello world",
    },
];
export default function App() {
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
    const [activeStripId, setActiveStripId] = useState();
    const [bayContent, setBayContent] = useState({
        RDY: INITIAL_STRIPS,
        STUP: [],
        PUSH: [],
        ACT: [],
        ARR: [],
        GMCAG: [],
    });
    return (_jsx("div", { className: "layout-page", children: _jsxs("div", { className: "layout-container", children: [_jsx(DndContext, { sensors: sensors, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onDragOver: handleDragOver, collisionDetection: closestCorners, children: _jsxs("div", { className: "layout-container gmc-amc-container", children: [_jsx("div", { className: "tl1", children: _jsx(Bay, { bay: { id: "RDY", title: "CDC Ready to Start" }, strips: bayContent["RDY"] }, "RDY") }), _jsx("div", { className: "tl2", children: _jsx(Bay, { bay: { id: "STUP", title: "Startup" }, strips: bayContent["STUP"] }, "STUP") }), _jsx("div", { className: "tl3", children: _jsx(Bay, { bay: { id: "PUSH", title: "Pushback" }, strips: bayContent["PUSH"] }, "PUSH") }), _jsx("div", { className: "tl4", children: _jsx(Bay, { bay: { id: "ACT", title: "Active" }, strips: bayContent["ACT"] }, "ACT") }), _jsx("div", { className: "tl5", children: _jsx(Bay, { bay: { id: "ARR", title: "AMC Arrivals" }, strips: bayContent["ARR"] }, "ARR") }), _jsx("div", { className: "tl6", children: _jsx(Bay, { bay: { id: "GMCAG", title: "GMC Active" }, strips: bayContent["GMCAG"] }, "GMCAG") })] }) }), _jsx(DragOverlay, { children: activeStripId ? (_jsx(Strip, { stripData: Object.values(bayContent)
                            .flat()
                            .find((obj) => Object.values(obj).includes(activeStripId)) })) : null }), _jsx("div", { className: "bottom-bar", children: _jsx("button", { onClick: createNewStrip, children: "Create new" }) })] }) }));
    function createNewStrip() {
        setBayContent((prev) => {
            return Object.assign(Object.assign({}, prev), { RDY: [...bayContent["RDY"], { id: "NEW", data: "hello world" }] });
        });
    }
    function findContainer(id) {
        if (id in bayContent) {
            //already a bay
            return id;
        }
        return Object.keys(bayContent).find((key) => bayContent[key].some((obj) => Object.values(obj).includes(id)));
    }
    function handleDragOver(event) {
        const { active, over } = event;
        if (!over)
            return;
        const stripId = active.id; //active strip callsign
        const overId = over.id; //over strip callsign
        console.log("overID:" + overId);
        const activeBay = findContainer(stripId);
        const overBay = findContainer(overId);
        console.log("activeBay:" + activeBay);
        console.log("overBay:" + overBay);
        if (!activeBay || !overBay || activeBay === overBay) {
            return;
        }
        setBayContent((prev) => {
            const activeBayContent = prev[activeBay];
            const overBayContent = prev[overBay];
            const activeBayIndex = activeBayContent.findIndex((obj) => Object.values(obj).includes(stripId));
            const overBayIndex = overBayContent.findIndex((obj) => Object.values(obj).includes(overId));
            let newIndex;
            if (overId in prev) {
                //root bay
                newIndex = overBayContent.length + 1;
            }
            else {
                const isBelowLastItem = over && overBayIndex === overBayContent.length - 1;
                const modifier = isBelowLastItem ? 1 : 0;
                newIndex =
                    overBayIndex >= 0
                        ? overBayIndex + modifier
                        : overBayContent.length + 1;
            }
            return Object.assign(Object.assign({}, prev), { [activeBay]: [
                    ...prev[activeBay].filter((item) => item["id"] !== stripId),
                ], [overBay]: [
                    ...prev[overBay].slice(0, newIndex),
                    bayContent[activeBay][activeBayIndex],
                    ...prev[overBay].slice(newIndex, prev[overBay].length),
                ] });
        });
    }
    function handleDragEnd(event) {
        const { active, over } = event;
        const stripId = active.id; //active strip callsign
        const overId = over.id; //over strip callsign
        console.log("overID:" + overId);
        const activeBay = findContainer(stripId);
        const overBay = findContainer(overId);
        console.log("activeBay:" + activeBay);
        console.log("overBay:" + overBay);
        if (!activeBay || !overBay || activeBay !== overBay) {
            return;
        }
        const activeBayIndex = bayContent[activeBay].findIndex((obj) => Object.values(obj).includes(stripId));
        const overBayIndex = bayContent[overBay].findIndex((obj) => Object.values(obj).includes(overId));
        if (activeBayIndex !== overBayIndex) {
            setBayContent((strips) => (Object.assign(Object.assign({}, strips), { [overBay]: arrayMove(bayContent[overBay], activeBayIndex, overBayIndex) })));
        }
        setActiveStripId(null);
    }
    function handleDragStart(event) {
        const { active } = event;
        const stripId = active.id;
        setActiveStripId(stripId);
    }
}
