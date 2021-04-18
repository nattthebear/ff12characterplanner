import * as React from "react";
import "./QeBoard.scss";
import PartyModel, { Coloring } from "../model/PartyModel";
import { Characters } from "../data/Characters";
import { License, Espers, Quickenings } from "../data/Licenses";
import { Board } from "../data/Boards";
import { dispatch, useStore } from "../store/Store";
import { useMemo } from "react";
import { changeIndices, changeParty, toggleQe } from "../store/State";

const allLimitedLicenses = [...Espers, ...Quickenings];

function compareLicenses(a: License, b: License) {
	return a.sortOrder - b.sortOrder;
}

export default function QeBoard() {
	const props = useStore();

	const colorings = useMemo(() => Characters.map((_, c) => props.party.color(c)), [props.party]);

	function renderCell(l: License, c: number, esper: boolean) {
		if (props.party.unemployed(c)) {
			return <div key={c} className="l unreachable" onClick={() => { dispatch(changeIndices(c, 0)); dispatch(toggleQe()); }}>
				Choose a job first.
			</div>;
		}

		const initial = colorings[c];
		let className;
		const content = Array<License>();
		let clickHandler: (() => void) | undefined;
		switch (initial.get(l)) {
			case Coloring.OBTAINED: {
				className = "l obtained";
				// cell is white => show anything white or grey now but yellow after removing that license (except for the license itself)

				// in certain cases, the unusual topology of double boards can cause the pathfinder to select a path to
				// a mist license B that goes through another already obtained mist license A, as this is the shortest way
				// if A is then removed, B is automatically lost.

				// on the normal boards, this isn't a problem because you get to see what's going on and obtain the licenses
				// in another way if you want, but it's not obvious what's happening on the mist planner

				// So, remember all obtained mist licenses before deleting and then re-add them.
				const toAdd = allLimitedLicenses.filter(ll => ll !== l && props.party.has(c, ll));
				const newParty = props.party.deleteAndAdd([{ c, l }], toAdd.map(l => ({ c, l })));
				const next = newParty.color(c);
				for (const [ll, color] of next) {
					if (color === Coloring.POSSIBLE && ll !== l) {
						const v = initial.get(ll);
						if (v === Coloring.OBTAINED || v === Coloring.CERTAIN) {
							content.push(ll);
						}
					}
				}

				clickHandler = () => dispatch(changeParty(newParty));
				break;
			}
			case Coloring.POSSIBLE: {
				className = "l possible";
				// cell is yellow => show anything yellow now but grey after adding that license
				const newParty = props.party.add(c, l);
				const next = newParty.color(c);
				for (const [ll, color] of initial) {
					if (color == Coloring.POSSIBLE && next.get(ll) === Coloring.CERTAIN) {
						content.push(ll);
					}
				}
				clickHandler = () => dispatch(changeParty(newParty));
				break;
			}
			default: {
				className = "l blocked";
				// cell is red
				// && esper => show anything yellow or red now but grey after removing esper from owner and adding it here
				// && quickening => show anything yellow or red now but grey after removing all quickenings from char and adding that one
				const nextParty = props.party.deleteAndAdd(
					esper
						? Characters.map((_, c) => ({ c, l }))
						: Quickenings.map(l => ({ c, l })),
					[{ c, l }]
				);
				const next = nextParty.color(c);
				for (const [ll, color] of next) {
					if (color === Coloring.CERTAIN) {
						const currentColor = initial.get(ll);
						if (currentColor == null || currentColor === Coloring.POSSIBLE) {
							content.push(ll);
						}
					}
				}
				break;
			}
		}
		content.sort(compareLicenses);
		return <div key={c} className={className} onClick={clickHandler}>
			{content.map((v, i) => <div key={i} aria-label={v.text}>{v.fullName}</div>)}
		</div>;
	}
	function renderRow(l: License, esper: boolean) {
		return <React.Fragment key={l.fullName}>
			<div>
				<div className="license-name" aria-label={l.text}>{l.fullName}</div>
			</div>
			{Characters.map((_, c) => renderCell(l, c, esper))}
		</React.Fragment>;
	}
	
	function renderJob(j: Board | undefined) {
		if (!j) {
			return <div className="job nojob">No Job</div>;
		} else {
			return <div className="job" aria-label={j.text}>{j.name}</div>;
		}
	}

	return <div className="qe-board">
		<div>{/* help goes here? */}</div>
		{Characters.map((character, c) => <div key={c}>
			<div className="character-name">{character.name}</div>
			{renderJob(props.party.getJob(c, 0))}
			{renderJob(props.party.getJob(c, 1))}
		</div>)}
		{Espers.map(e => renderRow(e, true))}
		{Quickenings.map(q => renderRow(q, false))}
	</div>;
}
