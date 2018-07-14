import * as React from "react";
import "./QeBoard.scss";
import PartyModel, { Coloring, ColorEx } from "../model/PartyModel";
import { Characters } from "../data/Characters";
import { License, Espers, Quickenings } from "../data/Licenses";
import { Board } from "../data/Boards";

export interface Props {
	party: PartyModel;
	changeParty(newParty: PartyModel): void;
	changeIndices(characterIndex: number, boardIndex: number): void;
	toggleQe(): void;
}

export interface State {
	colorings: ColorEx[];
}

export default class QeBoard extends React.PureComponent<Props, State> {
	state: State = { colorings: [] };

	static getDerivedStateFromProps(props: Props): State {
		const colorings = Array<ColorEx>();
		for (let c = 0; c < 6; c++) {
			colorings.push(props.party.colorEx(c));
		}
		return { colorings };
	}

	private renderCell(l: License, c: number, esper: boolean) {
		const initial = this.state.colorings[c];
		let className;
		const content = Array<License>();
		let clickHandler: (() => void) | undefined;
		switch (initial.map.get(l)) {
			case Coloring.OBTAINED: {
				className = "l obtained";
				// cell is white => anything white or grey now but yellow after removing that license (except for the license itself)
				const next = this.props.party.delete(c, l).colorEx(c);
				for (const ll of next.possible) {
					if (ll !== l) {
						const v = initial.map.get(ll);
						if (v === Coloring.OBTAINED || v === Coloring.CERTAIN) {
							content.push(ll);
						}
					}
				}
				clickHandler = () => this.props.changeParty(this.props.party.delete(c, l));
				break;
			}
			case Coloring.POSSIBLE: {
				className = "l possible";
				// cell is yellow => anything yellow now but grey after adding that license
				const next = this.props.party.add(c, l).colorEx(c);
				for (const ll of initial.possible) {
					if (next.certain.has(ll)) {
						content.push(ll);
					}
				}
				clickHandler = () => this.props.changeParty(this.props.party.add(c, l));
				break;
			}
			case Coloring.BLOCKED: {
				className = "l blocked";
				// cell is red
				// && esper => anything yellow or red now but grey after removing esper from owner and adding it here
				// && quickening => anything yellow or red now but grey after removing all quickenings from char and adding that one
				let nextParty = this.props.party;
				if (esper) {
					for (let i = 0; i < 6; i++) {
						nextParty = nextParty.delete(i, l);
					}
				} else {
					for (const q of Quickenings) {
						nextParty = nextParty.delete(c, q);
					}
				}
				nextParty = nextParty.add(c, l);
				const next = nextParty.colorEx(c);
				for (const ll of initial.possible) {
					if (next.certain.has(ll)) {
						content.push(ll);
					}
				}
				for (const ll of initial.blocked) {
					if (next.certain.has(ll)) {
						content.push(ll);
					}
				}
				break;
			}
			default:
				return <div key={c} className="l unreachable" onClick={() => { this.props.changeIndices(c, 0); this.props.toggleQe(); }}>
					Choose a job first.
				</div>;
		}
		return <div key={c} className={className} onClick={clickHandler}>
			{content.map((v, i) => <div key={i} aria-label={v.text}>{v.fullName}</div>)}
		</div>;
	}
	private renderRow(l: License, esper: boolean) {
		return <React.Fragment key={l.fullName}>
			<div>
				<div className="license-name" aria-label={l.text}>{l.fullName}</div>
			</div>
			{Characters.map((c, i) => this.renderCell(l, i, esper))}
		</React.Fragment>;
	}
	
	private renderJob(j: Board | undefined) {
		if (!j) {
			return <div className="job nojob">No Job</div>;
		} else {
			return <div className="job" aria-label={j.text}>{j.name}</div>;
		}
	}

	render() {
		return <div className="qe-board">
			<div>{/* help goes here? */}</div>
			{Characters.map((c, i) => <div key={i}>
				<div className="character-name">{c.name}</div>
				{this.renderJob(this.props.party.getJob(i, 0))}
				{this.renderJob(this.props.party.getJob(i, 1))}
			</div>)}
			{Espers.map(e => this.renderRow(e, true))}
			{Quickenings.map(q => this.renderRow(q, false))}
		</div>;
	}
}
