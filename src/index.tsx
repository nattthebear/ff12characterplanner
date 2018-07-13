import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./component/App";

ReactDOM.render(
	<App />,
	document.getElementById("root")!
);
// registerServiceWorker();

/*for (const b of Boards.values()) {
	for (const col of b) {
		for (const cell of col) {
			if (cell != null) {
				if (!LicensesByName.has(cell)) {
					console.log("Missing license", cell);
				}
			}
		}
	}
}*/
