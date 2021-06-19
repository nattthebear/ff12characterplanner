import { ComponentChildren, h } from "preact";
import { useState } from "preact/hooks";
import PartyModel from "../model/PartyModel";
import { changeParty } from "../store/State";
import { dispatch, useStore } from "../store/Store";

export interface ResetButtonProps {
	label: string;
	children: ComponentChildren;
	disabled?: boolean;
	getNextParty(): PartyModel;
}

interface ResetButtonUndo {
	from: PartyModel;
	to: PartyModel;
	label: string;
	children: ComponentChildren;
}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default function ResetButton(props: ResetButtonProps) {
	const store = useStore();
	const [undoRaw, changeUndo] = useState<ResetButtonUndo | undefined>(undefined);
	const undo = store.party === undoRaw?.from ? undoRaw : undefined;

	return <button
		className="action"
		aria-label={undo?.label ?? props.label}
		disabled={undo ? false : props.disabled}
		onClick={async () => {
			if (undo) {
				dispatch(changeParty(undo.to));
			} else {
				const currentParty = store.party;
				const nextParty = props.getNextParty();
				dispatch(changeParty(nextParty));
				const nextUndo = {
					from: nextParty,
					to: currentParty,
					label: `Undo ${props.label}`,
					children: <i>Undo {props.children}</i>,
				};
				changeUndo(nextUndo);
				await delay(5000);
				changeUndo(u => u === nextUndo ? undefined : u);
			}
		}}
	>
		{undo?.children ?? props.children}
	</button>;
}
