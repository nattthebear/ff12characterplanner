import { computePosition, shift, flip } from "@floating-ui/dom";
import { TPC, effect, h, scheduleUpdate } from "vdomk";
import "./MouseOver.css";

const Tooltip: TPC<{}> = (_, instance) => {
	let floatingElement: HTMLDivElement | null = null;
	const ref = (value: HTMLDivElement | null) => floatingElement = value;

	let labelText: string | null = null;
	let referenceElement: Element | null = null;

	document.addEventListener("mouseover", event => {
		let target = event.target as Element | null;
		while (target && (labelText = target.getAttribute("aria-label")) == null) {
			target = target.parentElement;
		}
		referenceElement = target;
		scheduleUpdate(instance);
	});

	async function updateStyles() {
		if (referenceElement && floatingElement) {
			const styles = await computePosition(referenceElement, floatingElement, { middleware: [flip(), shift()] });
			floatingElement.style.transform = `translate(${Math.round(styles.x)}px,${Math.round(styles.y)}px)`;
		}
	}

	document.addEventListener("scroll", updateStyles, { passive: true, capture: true });

	return () => {
		effect(instance, updateStyles);
		return <div ref={ref} class={labelText ? "tooltip" : "tooltip hidden"}>{labelText}</div>
	};
};

export default Tooltip;
