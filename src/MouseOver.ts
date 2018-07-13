import Popper from "popper.js";
import "./MouseOver.scss";

let popper: Popper | undefined;

document.addEventListener("mouseover", event => {
	let target = event.target as Element | null;
	let label: string | null = null;
	while (target && (label = target.getAttribute("aria-label")) == null) {
		target = target.parentElement;
	}
	if (popper) {
		popper.destroy();
		popper = undefined;
	}
	if (label) {
		const holder = document.createElement("div");
		holder.className = "tooltip";
		holder.textContent = label;
		document.body.appendChild(holder);
		popper = new Popper(target!, holder, { removeOnDestroy: true });
	}
});
