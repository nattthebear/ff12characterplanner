import { h, createRoot } from "vdomk";
import App from "./component/App";
import "./MouseOver";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
