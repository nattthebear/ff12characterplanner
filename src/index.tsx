import { h, createRoot } from "vdomk";
import App from "./component/App";
import "./MouseOver";

createRoot(document.getElementById("root")!, <App />);
