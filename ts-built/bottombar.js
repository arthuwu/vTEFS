import { jsx as _jsx } from "react/jsx-runtime";
import "./bottombar.css";
function createNewStrip() {
    console.log("h1");
}
export default function BottomBar() {
    return (_jsx("div", { className: "bottom-bar", children: _jsx("button", { onClick: createNewStrip, children: "Create new" }) }));
}
