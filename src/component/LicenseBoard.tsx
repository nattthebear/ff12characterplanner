import * as React from "react";
import CharacterModel, { Coloring } from "../model/CharacterModel";
import { License } from "../data/Licenses";
import { Position, Board, Boards } from "../data/Boards";

export interface Props {
	character: CharacterModel;
	index: number;
}

export default class LicenseBoard extends React.PureComponent<Props> {
	private renderPosition(key: number, pos: Position | undefined, colors: Map<License, Coloring>) {
		if (!pos) {
			return <td key={key} className="empty" />;
		}
		const l = pos.value;
		let className: string;
		switch (colors.get(l)) {
			case Coloring.OBTAINED: className = "l obtained"; break;
			case Coloring.CERTAIN: className = "l certain"; break;
			case Coloring.POSSIBLE: className = "l possible"; break;
			case Coloring.BLOCKED: className = "l blocked"; break;
			default: className = "l unreachable"; break; // shouldn't happen on this page unless license board data is bad
		}
		return <td key={key} className={className}>
			<span className="name">{l.fullName}</span>
			<span className="cost">{l.cost}</span>
		</td>;
	}

	private renderBoard(b: Board) {
		const colors = this.props.character.color();
		return <table className="license-board">
			<tbody>
				{b.rows.map((row, j) => <tr key={j}>
					{row.map((pos, i) => this.renderPosition(i, pos, colors))}
				</tr>)}
			</tbody>
		</table>;
	}

	private renderSelectJob(other: Board | undefined) {
		return <div className="select-job">
			{Boards.map((b, i) => {
				const disabled = b === other;
				return <button className="job" disabled={disabled} key={i}>
					{b.name}
				</button>;
			})}
		</div>;
	}
	
	render() {
		const b = this.props.character.getClass(this.props.index);
		if (b) {
			return this.renderBoard(b);
		} else {
			const otherBoard = this.props.character.getClass(this.props.index ^ 1);
			return this.renderSelectJob(otherBoard);
		}
	}
}
