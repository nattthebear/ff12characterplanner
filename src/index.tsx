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

import "modern-normalize/modern-normalize.css";
import "./component/shared.css";

import { h, Fragment, createRoot } from "vdomk";
import CharacterPlanner from "./component/CharacterPlanner";
import MouseOver from "./component/MouseOver";

createRoot(
	document.body,
	<>
		<CharacterPlanner />
		<MouseOver />
	</>
);
