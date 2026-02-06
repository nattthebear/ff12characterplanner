import { TPC, h, scheduleUpdate } from "vdomk";
import "./MouseOver.css";

const Tooltip: TPC<{}> = (_, instance) => {
	let labelText: string | null | undefined;
	let referenceElement: HTMLElement | null | undefined;

	function handleMouseOver(event: MouseEvent) {
		const previousReferenceElement = referenceElement;
		referenceElement = event.target as HTMLElement | null;
		while (referenceElement && (labelText = referenceElement.getAttribute("aria-label")) == null) {
			referenceElement = referenceElement.parentElement;
		}
		if (previousReferenceElement !== referenceElement) {
			previousReferenceElement?.style.removeProperty("anchor-name");
			referenceElement?.style.setProperty("anchor-name", "--tooltip");
			scheduleUpdate(instance);
		}
	}

	document.addEventListener("mouseover", handleMouseOver, { passive: true });
	document.documentElement.addEventListener("mouseleave", handleMouseOver, { passive: true });

	return () => {
		return <div class={labelText ? "tooltip" : "tooltip hidden"}>{labelText}</div>;
	};
};

export default Tooltip;
