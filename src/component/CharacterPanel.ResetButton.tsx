import { h, scheduleUpdate, TPC, VNode } from "vdomk";
import PartyModel from "../model/PartyModel";
import { changeParty } from "../store/State";
import { dispatch, useStore } from "../store/Store";

export interface ResetButtonProps {
	label: string;
	children: VNode;
	disabled?: boolean;
	getNextParty(): PartyModel;
}

interface ResetButtonUndo {
	from: PartyModel;
	to: PartyModel;
	label: string;
	children: VNode;
}

function delay(ms: number) {
	return new Promise<void>(resolve => setTimeout(resolve, ms));
}

const ResetButton: TPC<ResetButtonProps> = (_, instance) => {
	const getState = useStore(instance);
	let undoRaw: ResetButtonUndo | undefined;

	return (props) => {
		const store = getState();
		const undo = store.party === undoRaw?.from ? undoRaw : undefined;

		if (undo) {
			return <button
				class="action button"
				aria-label={undo.label}
				onClick={() => dispatch(changeParty(undo.to))}
			>
				{undo.children}
			</button>;
		} else {
			return <button
				class="action button"
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
					undoRaw = nextUndo;
					scheduleUpdate(instance);
					await delay(5000);
					if (undoRaw === nextUndo) {
						undoRaw = undefined;
						scheduleUpdate(instance);
					}
				}}
			>
				{props.children}
			</button>;
		}
	};
}
export default ResetButton;
