import * as Vex from "vex-js";
import "vex-js/dist/css/vex.css";
// import "vex-js/dist/css/vex-theme-plain.css";
import "./Dialog.scss";
import * as VexDialog from "vex-dialog";

Vex.registerPlugin(VexDialog);
Vex.defaultOptions.className = "vex-theme-plain";

export function confirm(message: string) {
	return new Promise<boolean>((resolve, reject) => {
		Vex.dialog.confirm({
			message,
			callback(value: boolean) {
				resolve(value);
			}
		});
	});
}
