import * as React from "react";
import PartyModel from "../model/PartyModel";
import { optimizeForCharacter } from "../dps/OptimizeForCharacter";
import { OptimizerResult } from "../dps/Optimize";
import { Characters } from "../data/Characters";
import "./Dps.scss";
import { Environment, Equipment, Profile, AllElements } from "../dps/Profile";
import { CalculateResult } from "../dps/Calculate";

export interface Props {
	party: PartyModel;
	env: Environment;
	changeEnv<K extends keyof Environment>(key: K, value: Environment[K]): void;
}

interface InputProps<T> {
	value: T;
	changeValue: (newValue: T) => void;
	label: string;
	tooltip: string;
}

interface NumberProps extends InputProps<number> {
	min: number;
	max: number;
}

let nextLabelId = 0;
function getId() {
	return "lid-" + ++nextLabelId;
}

function NumberInput(props: NumberProps) {
	const id = getId();
	return <div aria-label={props.tooltip} className="control">
		<label htmlFor={id}>{props.label}</label>
		<input
			id={id}
			type="number"
			value={props.value}
			min={props.min}
			max={props.max}
			onChange={ev => ev.currentTarget.validity.valid && props.changeValue(ev.currentTarget.valueAsNumber)}
		/>
	</div>;
}

function BoolInput(props: InputProps<boolean>) {
	const id = getId();
	return <div aria-label={props.tooltip} className="control">
		<input
			id={id}
			type="checkbox"
			checked={props.value}
			onChange={() => props.changeValue(!props.value)}
		/>
		<label htmlFor={id}>{props.label}</label>
	</div>;
}

function ElementInput(props: InputProps<0 | 0.5 | 1 | 2>) {
	const id = getId();
	return <div aria-label={props.tooltip} className="control">
		<label htmlFor={id}>{props.label}</label>
		<select value={props.value} id={id} onChange={ev => props.changeValue(Number(ev.currentTarget.value) as 0 | 0.5 | 1 | 2)}>
			<option value="0">Immune</option>
			<option value="0.5">Strong</option>
			<option value="1">Normal</option>
			<option value="2">Weak</option>
		</select>
	</div>;
}

function tooltipFor(e: Equipment) {
	const ret = Array<string>();
	if (e.animationType) {
		ret.push({
			unarmed: "Unarmed",
			dagger: "Dagger",
			ninja: "Ninja Sword",
			katana: "Katana",
			sword: "Sword",
			bigsword: "Greatsword",
			hammer: "Hammer/Axe",
			pole: "Pole",
			spear: "Spear",
			mace: "Mace",
			bow: "Bow",
			gun: "Gun",
			xbow: "Crossbow",
			measure: "Measure",
			rod: "Rod",
			staff: "Staff",
			handbomb: "Handbomb"
		}[e.animationType]);
	}
	if (e.damageType === "gun" && e.animationType !== "gun") {
		ret.push("Pierce");
	}
	function f(k: keyof Profile, s: string) {
		const v = e[k];
		if (typeof v === "number" && v > 0) {
			ret.push(`${v} ${s}`);
		} else if (v === true) {
			ret.push(s);
		}
	}
	f("attack", "Att");
	f("chargeTime", "CT");
	f("combo", "Cb");
	f("str", "Str");
	f("mag", "Mag");
	f("vit", "Vit");
	f("spd", "Spd");
	f("brawler", "Brawler");
	f("berserk", "Berserk");
	f("haste", "Haste");
	f("bravery", "Bravery");
	f("focus", "Focus");
	f("adrenaline", "Adrenaline");
	f("genjiGloves", "Combo+");
	for (const elt of AllElements) {
		f(elt + "Damage" as any, elt[0].toUpperCase() + elt.slice(1) + " Damage");
	}
	for (const elt of AllElements) {
		f(elt + "Bonus" as any, elt[0].toUpperCase() + elt.slice(1) + " Bonus");
	}
	return ret.join(",");
}

export default class Dps extends React.PureComponent<Props> {
	render() {
		return <div className="dps-optimizer">
			<div className="controls">
				<NumberInput
					min={0}
					max={250}
					label="Def"
					tooltip="Target's physical defense"
					value={this.props.env.def}
					changeValue={v => this.props.changeEnv("def", v)}
				/>
				<NumberInput
					min={0}
					max={250}
					label="MDef"
					tooltip="Target's magical defense"
					value={this.props.env.mdef}
					changeValue={v => this.props.changeEnv("mdef", v)}
				/>
				<NumberInput
					min={1}
					max={100}
					label="HP%"
					tooltip="Character's HP percentage"
					value={this.props.env.percentHp}
					changeValue={v => this.props.changeEnv("percentHp", v)}
				/>
				<NumberInput
					min={1}
					max={99}
					label="Lvl"
					tooltip="Character's level"
					value={this.props.env.level}
					changeValue={v => this.props.changeEnv("level", v)}
				/>
				<br />
				<BoolInput
					label="Resist G&M"
					tooltip="Does the target resist guns and measures?"
					value={this.props.env.resistGun}
					changeValue={v => this.props.changeEnv("resistGun", v)}
				/>
				{/* battle speed... (dropdown?) */}
				<BoolInput
					label="Berserk"
					tooltip="Is the berserk buff available?"
					value={this.props.env.berserk}
					changeValue={v => this.props.changeEnv("berserk", v)}
				/>
				<BoolInput
					label="Haste"
					tooltip="Is the haste buff available?"
					value={this.props.env.haste}
					changeValue={v => this.props.changeEnv("haste", v)}
				/>
				<BoolInput
					label="Bravery"
					tooltip="Is the bravery buff available?"
					value={this.props.env.bravery}
					changeValue={v => this.props.changeEnv("bravery", v)}
				/>
				<br />
				{AllElements.map(s => <ElementInput
					key={s}
					label={s[0].toUpperCase() + s.slice(1)}
					tooltip={`How much ${s} damage does the target take?`}
					value={(this.props.env as any)[s + "Reaction"]}
					changeValue={v => this.props.changeEnv(s + "Reaction" as any, v)}
				/>)}
			</div>
			<PartyDps party={this.props.party} env={this.props.env} />
		</div>;
	}
}

function EqCell(props: { value?: Equipment }) {
	const { value } = props;
	return <td
		aria-label={value && tooltipFor(value)}
	>
		{value && value.name}
	</td>;
}

function DpsCell(props: { value: CalculateResult }) {
	const { value } = props;
	return <td
		className="r"
		aria-label={`Base Damage: ${Math.round(value.baseDmg)}\nModified Damage: ${Math.round(value.modifiedDamage)}\nComboed Damage: ${Math.round(value.comboDamage)}\nCharge Time: ${value.chargeTime.toFixed(2)}s\nAnimation Time: ${value.animationTime.toFixed(2)}s`}
	>
		{Math.round(value.dps)}
	</td>;
}

interface PartyDpsProps {
	party: PartyModel;
	env: Environment;
}

interface PartyDpsState {
	results: OptimizerResult[][] | undefined;
	for: PartyDpsProps | undefined;
}

class PartyDps extends React.PureComponent<PartyDpsProps, PartyDpsState> {
	constructor(props: PartyDpsProps) {
		super(props);
		this.state = {
			results: undefined,
			for: undefined
		};
	}

	private async checkForCalculate() {
		const results: OptimizerResult[][] = [[], [], [], [], [], []];
		const { party, env } = this.props;

		for (let i = 0; i < 6; i++) {
			const dest = results[i];
			const characterEnv = { ...env, character: i };
			for await (const r of optimizeForCharacter(characterEnv, party)) {
				if (party !== this.props.party || env !== this.props.env) {
					// stop processing now if this data is already old
					return;
				}
				dest.push(r);
			}
			dest.sort((a, b) => b.dps.dps - a.dps.dps);
		}

		this.setState({
			results,
			for: {
				party,
				env
			}
		});
	}

	render() {
		const same = this.state.for && this.state.for.env === this.props.env && this.state.for.party === this.props.party;
		if (!same) {
			this.checkForCalculate();
		}
		const components = this.state.results
			? this.state.results.map((result, idx) => <SingleCharacterDps key={idx} name={Characters[idx].name} results={result} />)
			: <tr><td>Working...</td></tr>;

		return <div className={same ? "results" : "results busy"}>
			<table>
				<tbody>
					{components}
				</tbody>
			</table>	
		</div>;
	}
}

function SingleCharacterDps(props: { name: string, results: OptimizerResult[] }) {
	return <>
		<tr>
			<th colSpan={9999}>{props.name}</th>
		</tr>
		<tr>
			<th className="r">DPS</th>
			<th>Weapon</th>
			<th>Ammo</th>
			<th>Helm</th>
			<th>Armor</th>
			<th>Accessory</th>
		</tr>

		{props.results.map((r, i) => <tr key={i} className="data-row">
			<DpsCell value={r.dps} />
			<EqCell value={r.doll.weapon} />
			<EqCell value={r.doll.ammo} />
			<EqCell value={r.doll.helm} />
			<EqCell value={r.doll.armor} />
			<EqCell value={r.doll.accessory} />
		</tr>)}
	</>;
}
