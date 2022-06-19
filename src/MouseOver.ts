import { computePosition, autoUpdate, shift, flip } from "@floating-ui/dom";
import "./MouseOver.css";

const holder = document.createElement("div");
holder.className = "tooltip";
holder.style.display = "none";
document.body.appendChild(holder);

let cleanup: (() => void) | undefined;

document.addEventListener("mouseover", event => {
	let target = event.target as Element | null;
	let label: string | null = null;
	while (target && (label = target.getAttribute("aria-label")) == null) {
		target = target.parentElement;
	}
	cleanup?.();

	if (label) {
		holder.textContent = label;
		holder.style.display = "";
		async function updateStyles() {
			const styles = await computePosition(target!, holder, { middleware: [flip(), shift()] });
			holder.style.transform = `translate(${Math.round(styles.x)}px,${Math.round(styles.y)}px)`;
		}
		cleanup = autoUpdate(target!, holder, updateStyles, { ancestorResize: false, elementResize: false });
	} else {
		holder.style.display = "none";
		cleanup = undefined;
	}
});
