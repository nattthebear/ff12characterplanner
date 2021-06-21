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
	return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export default function ResetButton(props: ResetButtonProps) {
	const store = useStore();
	const [undoRaw, changeUndo] = useState<ResetButtonUndo | undefined>(undefined);
	const undo = store.party === undoRaw?.from ? undoRaw : undefined;

	if (undo) {
		return <button
			className="action"
			aria-label={undo.label}
			onClick={() => dispatch(changeParty(undo.to))}
		>
			{undo.children}
		</button>;
	} else {
		return <button
			className="action"
			aria-label={props.label}
			disabled={props.disabled}
			onClick={async () => {
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
			}}
		>
			{props.children}
		</button>;
	}
}
