import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./index.css";
import "./strip.css";
import { useDraggable } from "@dnd-kit/core";
export default function Strip({ stripData }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: stripData.id,
    });
    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
        }
        : undefined;
    return (_jsxs("div", { ref: setNodeRef, className: "strip-container", style: style, children: [_jsx("div", Object.assign({}, listeners, attributes, { className: "strip-callsign", children: stripData.id })), _jsx("div", { className: "strip-data", children: stripData.data })] }));
}
