if (!Array.prototype.at) {
	Object.defineProperty(Array.prototype, "at", {
		configurable: true,
		enumerable: false,
		value: function at(index: number) {
			const { length } = this;
			if (index < 0) {
				index += length;
			}
			if (index >= 0 && index < length) {
				return this[index];
			}
		},
	});
}
if (!window.requestIdleCallback) {
	window.requestIdleCallback = function requestIdleCallback(callback) {
		return setTimeout(callback, 0);
	};
	window.cancelIdleCallback = function cancelIdleCallback(handle) {
		clearTimeout(handle);
	};
}

import { h, createRoot } from "vdomk";
import App from "./component/App";
import "./MouseOver";

createRoot(
	document.body,
	<App />,
	document.body.lastChild // tooltip must come after the app root
);
