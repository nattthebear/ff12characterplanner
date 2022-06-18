import { ComponentChild, h } from "preact";
import "./CharacterPanel.css";
import { LicenseGroups, LicenseGroup, License } from "../data/Licenses";
import PartyModel, { Coloring } from "../model/PartyModel";
import { Characters } from "../data/Characters";
import { dispatch, useStore } from "../store/Store";
import { changeIndices, changeParty, toggleDps, toggleQe } from "../store/State";
import ResetButton from "./CharacterPanel.ResetButton";

export default function CharacterPanel() {
	const store = useStore();

	function renderClassInfo(characterIndex: number, index: number) {
		const j = store.party.getJob(characterIndex, index);
		const selected = store.characterIndex === characterIndex && store.boardIndex === index;
		if (!j) {
			const disabled = index === 1 && !store.party.getJob(characterIndex, 0);
			return <button disabled={disabled} class="job nojob" aria-pressed={selected} onClick={ev => { ev.stopPropagation(); dispatch(changeIndices(characterIndex, index)); }}>
				<span class="name">No Job</span>
			</button>;
		} else {
			return <button class="job" aria-pressed={selected} onClick={ev => { ev.stopPropagation(); dispatch(changeIndices(characterIndex, index)); }}>
				<span class="name">{j.name}</span>
			</button>;
		}
	}

	function renderLicenseGroup(g: LicenseGroup, i: number, colors: Map<License, Coloring>, plannedColors?: Map<License, Coloring>) {
		const children = Array<ComponentChild>();
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
					default:
						if (plannedColors && plannedColors.has(l)) {
							d.push(l);
						}
						break;
				}
			}
			const onClick = (licenses: License[], add: boolean) => {
				let party = store.party;
				for (const l of licenses) {
					if (add) {
						party = party.add(store.characterIndex, l);
					} else {
						party = party.delete(store.characterIndex, l);
					}
					dispatch(changeParty(party));
				}
			};
			if (a.length) { children.push(<p key={0} class="l obtained" onClick={() => onClick(a, false)}>+{a.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (b.length) { children.push(<p key={1} class="l certain" onClick={() => onClick(b, true)}>+{b.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (c.length) { children.push(<p key={2} class="l possible" onClick={() => onClick(c, true)}>+{c.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (d.length) { children.push(<p key={3} class="l planned">+{d.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
		} else {
			// display each license (could display each granted spell if desired?)
			for (const l of g.contents) {
				let className: string;
				let obtained = false;
				switch (colors.get(l)) {
					case Coloring.OBTAINED: className = "l obtained"; obtained = true; break;
					case Coloring.CERTAIN: className = "l certain"; break;
					case Coloring.POSSIBLE: className = "l possible"; break;
					default:
						if (plannedColors && plannedColors.has(l)) {
							className = "l planned"; break;
						} else {
							continue; // don't render not at all available licenses
						}
				}
				const onClick = () => {
					if (obtained) {
						dispatch(changeParty(store.party.delete(store.characterIndex, l)));
					} else {
						dispatch(changeParty(store.party.add(store.characterIndex, l)));
					}
				};
				children.push(<p
					key={l.fullName}
					class={className}
					aria-label={l.text}
					onClick={onClick}
				>
					{l.fullName}
				</p>);
			}
		}
		if (children.length) {
			return <div key={i} class="group">
				<h3 class="name">{g.name}</h3>
				{children}
			</div>;
		} else {
			return null;
		}
	}

	function renderStatInfo() {
		const colors = store.party.color(store.characterIndex);
		const plannedColors = store.plannedParty && store.plannedParty.color(store.characterIndex);
		return LicenseGroups.map((g, i) => renderLicenseGroup(g, i, colors, plannedColors));
	}

	function renderResetJob() {
		const c = store.characterIndex;
		const job = store.party.getJob(c, store.boardIndex);
		let label: string;
		let disabled: boolean;
		if (job) {
			label = `Unlearn ${job.name} from ${Characters[c].name}`;
			disabled = false;
		} else {
			label = `Unlearn current job from ${Characters[c].name}`;
			disabled = true;
		}
		return <ResetButton
			label={label}
			disabled={disabled}
			getNextParty={() => store.party.removeJob(c, job!)}
		>
			Reset Job
		</ResetButton>;
	}

	function renderResetCharacter() {
		const c = store.characterIndex;
		const disabled = store.party.unemployed(c);
		const label = `Unlearn all jobs from ${Characters[c].name}`;
		return <ResetButton
			label={label}
			disabled={disabled}
			getNextParty={() => store.party.removeAllJobs(c)}
		>
			Reset Character
		</ResetButton>;
	}

	function renderResetAll() {
		const disabled = store.party.allUnemployed();
		return <ResetButton
			label="Unlearn all jobs from all characters"
			disabled={disabled}
			getNextParty={() => new PartyModel()}
		>
			Reset All
		</ResetButton>;
	}

	function renderToggleQe() {
		return <button
			class="action button"
			aria-label="Manage Quickenings and Espers for all characters at once."
			onClick={() => dispatch(toggleQe())}
			aria-pressed={store.qeActive}
		>
			{store.qeActive ? "Hide Mist Planner" : "Show Mist Planner"}
		</button>;
	}

	function renderToggleDps() {
		return <button
			class="action button"
			aria-label="Simulate character damage output"
			onClick={() => dispatch(toggleDps())}
			aria-pressed={store.dpsActive}
		>
			{store.dpsActive ? "Hide DPS Simulator" : "Show DPS Simulator"}
		</button>;		
	}

	function selectCharacter(index: number) {
		if (store.characterIndex === index) {
			dispatch(changeIndices(index, store.boardIndex ^ 1));
		} else {
			dispatch(changeIndices(index, 0));
		}
	}

	return <div class="character-panel">
		<div class="actions">
			{renderResetJob()}
			{renderResetCharacter()}
			{renderResetAll()}
			{renderToggleQe()}
			{renderToggleDps()}
		</div>
		<div class="character-select">
			{Characters.map((c, i) => <div class="character button" aria-pressed={store.characterIndex === i} onClick={() => selectCharacter(i)}>
				<span class="name">{c.name}</span>
				<br />
				{renderClassInfo(i, 0)}
				<br />
				{renderClassInfo(i, 1)}
				<br />
				<span>{store.party.getLpCount(i)} LP</span>
			</div>)}
		</div>
		<div class="stats">
			{renderStatInfo()}
		</div>
	</div>;
}
