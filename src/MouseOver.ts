import { createPopper, Instance } from '@popperjs/core';
import "./MouseOver.scss";

let popper: Instance | undefined;

document.addEventListener("mouseover", event => {
	let target = event.target as Element | null;
	let label: string | null = null;
	while (target && (label = target.getAttribute("aria-label")) == null) {
		target = target.parentElement;
	}
	if (popper) {
		popper.destroy();
		popper.state.elements.popper.remove();
		popper = undefined;
	}
	if (label) {
		const holder = document.createElement("div");
		holder.className = "tooltip";
		holder.textContent = label;
		document.body.appendChild(holder);
		popper = createPopper(target!, holder);
	}
});
