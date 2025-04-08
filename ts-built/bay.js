import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDroppable } from "@dnd-kit/core";
import Strip from "./strip";
import "./bay.css";
export default function Bay({ bay, strips }) {
    const { setNodeRef } = useDroppable({
        id: bay.id,
    });
    return (_jsxs("div", { className: "bay-container", children: [_jsx("div", { className: "bay-title", children: bay.title }), _jsx("div", { ref: setNodeRef, className: "bay-drop-area", children: strips.map((strip) => {
                    return _jsx(Strip, { stripData: strip }, strip.id);
                }) })] }));
}
