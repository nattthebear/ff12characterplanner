import * as React from "react";
import "./CharacterPanel.scss";
import { LicenseGroups, LicenseGroup, License } from "../data/Licenses";
import PartyModel, { Coloring } from "../model/PartyModel";
import { Characters } from "../data/Characters";
import { confirm } from "../Dialog";
import { dispatch, useStore } from "../store/Store";
import { changeIndices, changeParty, toggleDps, toggleQe } from "../store/State";

export default function CharacterPanel() {
	const props = useStore();

	function renderClassInfo(characterIndex: number, index: number) {
		const j = props.party.getJob(characterIndex, index);
		const selected = props.characterIndex === characterIndex && props.boardIndex === index;
		if (!j) {
			const disabled = index === 1 && !props.party.getJob(characterIndex, 0);
			return <button disabled={disabled} className="job nojob" aria-pressed={selected} onClick={ev => { ev.stopPropagation(); dispatch(changeIndices(characterIndex, index)); }}>
				<span className="name">No Job</span>
			</button>;
		} else {
			return <button className="job" aria-pressed={selected} onClick={ev => { ev.stopPropagation(); dispatch(changeIndices(characterIndex, index)); }}>
				<span className="name">{j.name}</span>
			</button>;
		}
	}

	function renderLicenseGroup(g: LicenseGroup, i: number, colors: Map<License, Coloring>, plannedColors?: Map<License, Coloring>) {
		const children = Array<React.ReactNode>();
		if (typeof g.contents[0].grants!.what === "number") {
			// display a numeric total
			const a = Array<License>();
			const b = Array<License>();
			const c = Array<License>();
			const d = Array<License>();
			for (const l of g.contents) {
				switch (colors.get(l)) {
					case Coloring.OBTAINED: a.push(l); break;
					case Coloring.CERTAIN: b.push(l); break;
					case Coloring.POSSIBLE: c.push(l); break;
					case Coloring.BLOCKED:
					default:
						if (plannedColors && plannedColors.has(l) && plannedColors.get(l) !== Coloring.BLOCKED) {
							d.push(l);
						}
						break;
				}
			}
			const onClick = (licenses: License[], add: boolean) => {
				let party = props.party;
				for (const l of licenses) {
					if (add) {
						party = party.add(props.characterIndex, l);
					} else {
						party = party.delete(props.characterIndex, l);
					}
					dispatch(changeParty(party));
				}
			};
			if (a.length) { children.push(<p key={0} className="l obtained" onClick={() => onClick(a, false)}>+{a.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (b.length) { children.push(<p key={1} className="l certain" onClick={() => onClick(b, true)}>+{b.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (c.length) { children.push(<p key={2} className="l possible" onClick={() => onClick(c, true)}>+{c.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (d.length) { children.push(<p key={3} className="l planned">+{d.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
		} else {
			// display each license (could display each granted spell if desired?)
			for (const l of g.contents) {
				let className: string;
				let obtained = false;
				switch (colors.get(l)) {
					case Coloring.OBTAINED: className = "l obtained"; obtained = true; break;
					case Coloring.CERTAIN: className = "l certain"; break;
					case Coloring.POSSIBLE: className = "l possible"; break;
					case Coloring.BLOCKED:
					default:
						if (plannedColors && plannedColors.has(l) && plannedColors.get(l) !== Coloring.BLOCKED) {
							className = "l planned"; break;
						} else {
							continue; // don't render not at all available licenses
						}
				}
				const onClick = () => {
					if (obtained) {
						dispatch(changeParty(props.party.delete(props.characterIndex, l)));
					} else {
						dispatch(changeParty(props.party.add(props.characterIndex, l)));
					}
				};
				children.push(<p
					key={l.fullName}
					className={className}
					aria-label={l.text}
					onClick={onClick}
				>
					{l.fullName}
				</p>);
			}
		}
		if (children.length) {
			return <div key={i} className="group">
				<h3 className="name">{g.name}</h3>
				{children}
			</div>;
		} else {
			return null;
		}
	}

	function renderStatInfo() {
		const colors = props.party.color(props.characterIndex);
		const plannedColors = props.plannedParty && props.plannedParty.color(props.characterIndex);
		return LicenseGroups.map((g, i) => renderLicenseGroup(g, i, colors, plannedColors));
	}

	function renderResetJob() {
		const c = props.characterIndex;
		const job = props.party.getJob(c, props.boardIndex);
		let label: string;
		let disabled: boolean;
		if (job) {
			label = `Unlearn ${job.name} from ${Characters[c].name}`;
			disabled = false;
		} else {
			label = `Unlearn current job from ${Characters[c].name}`;
			disabled = true;
		}
		return <button
			className="action"
			aria-label={label}
			disabled={disabled}
			onClick={async () => {
				if (await confirm(label + "?")) {
					dispatch(changeParty(props.party.removeJob(c, job!)));
				}
			}}
		>
			Reset Job
		</button>;
	}

	function renderResetCharacter() {
		const c = props.characterIndex;
		const disabled = props.party.unemployed(c);
		const label = `Unlearn all jobs from ${Characters[c].name}`;
		return <button
			className="action"
			aria-label={label}
			disabled={disabled}
			onClick={async () => {
				if (await confirm(label + "?")) {
					dispatch(changeParty(props.party.removeAllJobs(c)));
				}
			}}
		>
			Reset Character
		</button>;
	}

	function renderResetAll() {
		const disabled = props.party.allUnemployed();
		return <button
			className="action"
			aria-label="Unlearn all jobs from all characters"
			disabled={disabled}
			onClick={async () => {
				if (await confirm("Unlearn all jobs from all characters?")) {
					dispatch(changeParty(new PartyModel()));
				}
			}}
		>
			Reset All
		</button>;
	}

	function renderToggleQe() {
		return <button
			className="action"
			aria-label="Manage Quickenings and Espers for all characters at once."
			onClick={() => dispatch(toggleQe())}
			aria-pressed={props.qeActive}
		>
			{props.qeActive ? "Hide Mist Planner" : "Show Mist Planner"}
		</button>;
	}

	function renderToggleDps() {
		return <button
			className="action"
			aria-label="Simulate character damage output"
			onClick={() => dispatch(toggleDps())}
			aria-pressed={props.dpsActive}
		>
			{props.dpsActive ? "Hide DPS Simulator" : "Show DPS Simulator"}
		</button>;		
	}

	function selectCharacter(index: number) {
		if (props.characterIndex === index) {
			dispatch(changeIndices(index, props.boardIndex ^ 1));
		} else {
			dispatch(changeIndices(index, 0));
		}
	}

	return <div className="character-panel">
		<div className="actions">
			{renderResetJob()}
			{renderResetCharacter()}
			{renderResetAll()}
			{renderToggleQe()}
			{renderToggleDps()}
		</div>
		<div className="character-select">
			{Characters.map((c, i) => <div className="character" key={i} aria-pressed={props.characterIndex === i} onClick={() => selectCharacter(i)}>
				<span className="name">{c.name}</span>
				<br />
				{renderClassInfo(i, 0)}
				<br />
				{renderClassInfo(i, 1)}
				<br />
				<span>{props.party.getLpCount(i)} LP</span>
			</div>)}
		</div>
		<div className="stats">
			{renderStatInfo()}
		</div>
	</div>;
}
