import { h, Fragment, TPC } from "vdomk";
import "./QeBoard.css";
import { Characters } from "../data/Characters";
import { License, AllLimitedLicenses } from "../data/Licenses";
import { Board } from "../data/Boards";
import { dispatch, useStore } from "../store/Store";
import { changeIndices, changeParty, toggleQe } from "../store/State";
import PartyModel from "../model/PartyModel";

function compareLicenses(a: License, b: License) {
	return a.sortOrder - b.sortOrder;
}

const QeBoard: TPC<{}> = (_, instance) => {
	const getState = useStore(instance);
	let party: PartyModel;
	let coversByCharacter: Map<License, License[]>[];

	function renderCell(mist: License, c: number) {
		if (party.unemployed(c)) {
			return <div class="l unreachable" onClick={() => { dispatch(changeIndices(c, 0)); dispatch(toggleQe()); }}>
				Choose a job first.
			</div>;
		}

		const covers = coversByCharacter[c];
		let className;
		let clickHandler: (() => void) | undefined;
		let content: License[];

		{
			const contentSet = new Set<License>();
			for (const license of covers.get(mist)!) {
				contentSet.add(license);
			}
			for (const otherMist of AllLimitedLicenses) {
				if (otherMist !== mist && party.has(c, otherMist)) {
					for (const license of covers.get(otherMist)!) {
						contentSet.delete(license);
					}
				}
			}
			content = [...contentSet];
		}

		if (party.has(c, mist)) {
			className = "l obtained";
			// cell is white => show anything white or grey now but yellow after removing that license (except for the license itself)

			// in certain cases, the unusual topology of double boards can cause the pathfinder to select a path to
			// a mist license B that goes through another already obtained mist license A, as this is the shortest way
			// if A is then removed, B is automatically lost.

			// on the normal boards, this isn't a problem because you get to see what's going on and obtain the licenses
			// in another way if you want, but it's not obvious what's happening on the mist planner

			// So, remember all obtained mist licenses before deleting and then re-add them.
			clickHandler = () => {
				const toAdd = AllLimitedLicenses.filter(ll => ll !== mist && party.has(c, ll));
				const newParty = party.deleteAndAdd([{ c, l: mist }], toAdd.map(l => ({ c, l })));
				dispatch(changeParty(newParty));
			};
		} else if (!party.isBlocked(c, mist)) {
			className = "l possible";
			// cell is yellow => show anything yellow now but grey after adding that license
			clickHandler = () => {
				const newParty = party.add(c, mist);
				dispatch(changeParty(newParty));
			};
		} else {
			className = "l blocked";
			// cell is red
			// && esper => show anything yellow or red now but grey after removing esper from owner and adding it here
			// && quickening => show anything yellow or red now but grey after removing all quickenings from char and adding that one
		}
		content.sort(compareLicenses);
		return <div class={className} onClick={clickHandler}>
			{content.map(v => <div aria-label={v.text}>{v.fullName}</div>)}
		</div>;
	}
	function renderRow(mist: License) {
		return <>
			<div>
				<div class="license-name" aria-label={mist.text}>{mist.fullName}</div>
			</div>
			{Characters.map((_, c) => renderCell(mist, c))}
		</>;
	}

	function renderJob(j: Board | undefined) {
		if (!j) {
			return <div class="job nojob">No Job</div>;
		} else {
			return <div class="job" aria-label={j.text}>{j.name}</div>;
		}
	}

	return () => {
		({ party } = getState());
		coversByCharacter = Characters.map((_, c) => party.getCovered(c));

		return <div class="qe-board">
			<div>{/* help goes here? */}</div>
			{Characters.map((character, c) => <div>
				<div class="character-name">{character.name}</div>
				{renderJob(party.getJob(c, 0))}
				{renderJob(party.getJob(c, 1))}
			</div>)}
			{AllLimitedLicenses.map(renderRow)}
		</div>;
	}
}
export default QeBoard;
