import * as React from "react";
import { License } from "../data/Licenses";
import { Position, Board, Boards } from "../data/Boards";
import "./LicenseBoard.scss";
import PartyModel, { Coloring } from "../model/PartyModel";
import GithubCorner from "./GithubCorner";

export interface Props {
	party: PartyModel;
	changeParty(newParty: PartyModel): void;
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
	changePlannedParty(plannedParty: PartyModel | undefined): void;
}

export default class LicenseBoard extends React.PureComponent<Props> {
	private renderPosition(key: number, pos: Position | undefined, colors: Map<License, Coloring>) {
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
			case Coloring.BLOCKED: className = "l blocked"; break;
			default: className = "l unreachable"; break; // shouldn't happen on this page unless license board data is bad
		}
		const onClick = () => {
			if (obtained) {
				this.props.changeParty(this.props.party.delete(this.props.characterIndex, l));
			} else {
				this.props.changeParty(this.props.party.add(this.props.characterIndex, l));
			}
		};
		return <td key={key} className={className} onClick={onClick} aria-label={l.text}>
			<div className="name">{l.fullName}</div>
			<div className="cost">{l.cost}</div>
		</td>;
	}

	private renderBoard(b: Board) {
		const colors = this.props.party.color(this.props.characterIndex);
		return <div className="license-board-holder">
			<table className="license-board">
				<tbody>
					{b.rows.map((row, j) => <tr key={j}>
						{row.map((pos, i) => this.renderPosition(i, pos, colors))}
					</tr>)}
				</tbody>
			</table>
		</div>;
	}

	private renderSelectJob(other: Board | undefined) {
		return <div className="select-job">
			{Boards.map((b, i) => <button
				key={i}
				onClick={() => this.props.changeParty(this.props.party.addJob(this.props.characterIndex, b))}
				className="job"
				disabled={b === other}
				aria-label={b.text}
				onMouseOver={() => this.props.changePlannedParty(this.props.party.addJob(this.props.characterIndex, b))}
				onMouseOut={() => this.props.changePlannedParty(undefined)}
			>
				<img className="zodiac" src={b.image} />
				{b.name}
			</button>)}
			<GithubCorner />
		</div>;
	}

	render() {
		const b = this.props.party.getJob(this.props.characterIndex, this.props.boardIndex);
		if (b) {
			return this.renderBoard(b);
		} else {
			const otherBoard = this.props.party.getJob(this.props.characterIndex, this.props.boardIndex ^ 1);
			return this.renderSelectJob(otherBoard);
		}
	}
}
