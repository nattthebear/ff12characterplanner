import { h, createRoot } from "vdomk";
import App from "./component/App";
import "./MouseOver";

createRoot(
	document.body,
	<App />,
	document.body.lastChild // tooltip must come after the app root
);
