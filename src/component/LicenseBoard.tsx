import * as React from "react";
import { License } from "../data/Licenses";
import { Position, Board, Boards } from "../data/Boards";
import "./LicenseBoard.scss";
import { Coloring } from "../model/PartyModel";
import GithubCorner from "./GithubCorner";
import { dispatch, useStore } from "../store/Store";
import { changeParty, changePlannedParty } from "../store/State";

export default function LicenseBoard() {
	const props = useStore();

	function renderPosition(key: number, pos: Position | undefined, colors: Map<License, Coloring>) {
		if (!pos) {
			return <td key={key} className="empty" />;
		}
		const l = pos.value;
		let className: string;
		let obtained = false;
		switch (colors.get(l)) {
			case Coloring.OBTAINED: className = "l obtained"; obtained = true; break;
			case Coloring.CERTAIN: className = "l certain"; break;
			case Coloring.POSSIBLE: className = "l possible"; break;
			default: className = "l blocked"; break;
		}
		const onClick = () => {
			if (obtained) {
				dispatch(changeParty(props.party.delete(props.characterIndex, l)));
			} else {
				dispatch(changeParty(props.party.add(props.characterIndex, l)));
			}
		};
		return <td key={key} className={className} onClick={onClick} aria-label={l.text}>
			<div className="name">{l.fullName}</div>
			<div className="cost">{l.cost}</div>
		</td>;
	}

	function renderBoard(b: Board) {
		const colors = props.party.colorFoo(props.characterIndex);
		return <div className="license-board-holder">
			<table className="license-board">
				<tbody>
					{b.rows.map((row, j) => <tr key={j}>
						{row.map((pos, i) => renderPosition(i, pos, colors))}
					</tr>)}
				</tbody>
			</table>
		</div>;
	}

	function renderSelectJob(other: Board | undefined) {
		return <div className="select-job">
			{Boards.map((b, i) => <button
				key={i}
				onClick={() => dispatch(changeParty(props.party.addJob(props.characterIndex, b)))}
				className="job"
				disabled={b === other}
				aria-label={b.text}
				onMouseOver={() => dispatch(changePlannedParty(props.party.addJob(props.characterIndex, b)))}
				onMouseOut={() => dispatch(changePlannedParty(undefined))}
			>
				<img className="zodiac" src={b.image} alt={b.imageAlt} />
				{b.name}
			</button>)}
			<GithubCorner />
		</div>;
	}

	const b = props.party.getJob(props.characterIndex, props.boardIndex);
	if (b) {
		return renderBoard(b);
	} else {
		const otherBoard = props.party.getJob(props.characterIndex, props.boardIndex ^ 1);
		return renderSelectJob(otherBoard);
	}
}
