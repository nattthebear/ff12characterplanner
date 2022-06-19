import { computePosition, shift, flip } from "@floating-ui/dom";
import "./MouseOver.css";

const holder = document.createElement("div");
holder.className = "tooltip";
holder.style.display = "none";
document.body.appendChild(holder);

let reference: Element | null = null;

async function updateStyles() {
	if (reference) {
		const styles = await computePosition(reference, holder, { middleware: [flip(), shift()] });
		holder.style.transform = `translate(${Math.round(styles.x)}px,${Math.round(styles.y)}px)`;
	}
}

document.addEventListener("mouseover", event => {
	let target = event.target as Element | null;
	let label: string | null = null;
	while (target && (label = target.getAttribute("aria-label")) == null) {
		target = target.parentElement;
	}
	reference = target;

	if (label) {
		holder.textContent = label;
		holder.style.display = "";
		updateStyles();
	} else {
		holder.style.display = "none";
	}
});
document.addEventListener("scroll", updateStyles, { passive: true, capture: true });
