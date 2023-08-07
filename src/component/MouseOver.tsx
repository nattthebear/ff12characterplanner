import { computePosition, shift, flip } from "@floating-ui/dom";
import { TPC, effect, h, scheduleUpdate } from "vdomk";
import "./MouseOver.css";

const Tooltip: TPC<{}> = (_, instance) => {
	let floatingElement: HTMLDivElement | null = null;
	const ref = (value: HTMLDivElement | null) => floatingElement = value;

	let labelText: string | null = null;
	let referenceElement: Element | null = null;

	function handleMouseOver(event: MouseEvent) {
		referenceElement = event.target as Element | null;
		while (referenceElement && (labelText = referenceElement.getAttribute("aria-label")) == null) {
			referenceElement = referenceElement.parentElement;
		}
		scheduleUpdate(instance);		
	}

	document.addEventListener("mouseover", handleMouseOver, { passive: true });
	document.documentElement.addEventListener("mouseleave", handleMouseOver, { passive: true });

	async function updateStyles() {
		if (referenceElement && floatingElement) {
			const styles = await computePosition(referenceElement, floatingElement, { middleware: [flip(), shift()], strategy: "fixed" });
			floatingElement.style.transform = `translate(${Math.round(styles.x)}px,${Math.round(styles.y)}px)`;
		}
	}

	document.addEventListener("scroll", updateStyles, { passive: true, capture: true });

	return () => {
		effect(instance, updateStyles);
		return <div ref={ref} class={labelText ? "tooltip" : "tooltip hidden"}>{labelText}</div>;
	};
};

export default Tooltip;
