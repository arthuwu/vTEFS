import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./layout";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(_jsx(_Fragment, { children: _jsx("div", { children: _jsx(App, {}) }) }));
