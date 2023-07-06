import { h, Fragment, TPC, effect, scheduleUpdate } from "vdomk";
import PartyModel from "../model/PartyModel";
import { optimizeForCharacter } from "../dps/OptimizeForCharacter";
import { OptimizerResult } from "../dps/Optimize";
import { Characters } from "../data/Characters";
import "./Dps.css";
import { Environment, Equipment, Profile, AllElements, Weather, Terrain, defaultEnvironment } from "../dps/Profile";
import { CalculateResult } from "../dps/Calculate";
import { makeStore } from "../store/MakeStore";
import { Ability } from "../dps/ability/Ability";
import { createSelector } from "./memo";

export interface Props {
	party: PartyModel;
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

function NumberInput(props: NumberProps) {
	return <div aria-label={props.tooltip} class="control">
		<label>
			{props.label}
			<input
				class={`d-${props.max.toString().length}`}
				type="number"
				value={props.value}
				min={props.min}
				max={props.max}
				onChange={ev => {
					if (ev.currentTarget.validity.valid) {
						const newValue = ev.currentTarget.valueAsNumber;
						if (newValue === newValue) {
							props.changeValue(newValue);
						}
					}
				}}
			/>
		</label>
	</div>;
}

function BoolInput(props: InputProps<boolean>) {
	return <div aria-label={props.tooltip} class="control">
		<label>
			<input
				type="checkbox"
				checked={props.value}
				onChange={() => props.changeValue(!props.value)}
			/>
			{props.label}
		</label>
	</div>;
}

function ElementInput(props: InputProps<0 | 0.5 | 1 | 2>) {
	return <div aria-label={props.tooltip} class="control">
		<label>
			{props.label}
			<select value={props.value} onChange={ev => props.changeValue(Number(ev.currentTarget.value) as 0 | 0.5 | 1 | 2)}>
				<option value="0">Immune</option>
				<option value="0.5">Strong</option>
				<option value="1">Normal</option>
				<option value="2">Weak</option>
			</select>
		</label>
	</div>;
}
function WeatherInput(props: InputProps<Weather>) {
	return <div aria-label={props.tooltip} class="control">
		<label>
			{props.label}
			<select value={props.value} onChange={ev => props.changeValue(ev.currentTarget.value as Weather)}>
				<option value="other">None</option>
				<option value="windy">Wind</option>
				<option value="rainy">Rain</option>
				<option value="foggy">Fog</option>
				<option value="windy and rainy">Downpour</option>
			</select>
		</label>
	</div>;
}
function TerrainInput(props: InputProps<Terrain>) {
	return <div aria-label={props.tooltip} class="control">
		<label>
			{props.label}
			<select value={props.value} onChange={ev => props.changeValue(ev.currentTarget.value as Terrain)}>
				<option value="other">None</option>
				<option value="sand">Sand</option>
				<option value="water">Water</option>
				<option value="snow">Snow</option>
			</select>
		</label>
	</div>;
}

const { useStore, dispatch } = makeStore(defaultEnvironment);
const changeEnv = <K extends keyof Environment>(key: K, value: Environment[K]) =>
	dispatch(e => ({ ...e, [key]: value }));

const DPS: TPC<Props> = (_, instance) => {
	const getEnv = useStore(instance);

	return props => {
		const env = getEnv();
		return <div class="dps-optimizer">
			<div class="controls">
				<NumberInput
					min={0}
					max={250}
					label="Def"
					tooltip="Target's physical defense"
					value={env.def}
					changeValue={v => changeEnv("def", v)}
				/>
				<NumberInput
					min={0}
					max={250}
					label="MDef"
					tooltip="Target's magical defense"
					value={env.mdef}
					changeValue={v => changeEnv("mdef", v)}
				/>
				<NumberInput
					min={1}
					max={10}
					label="Aoe"
					tooltip="Number of targets"
					value={env.targetCount}
					changeValue={v => changeEnv("targetCount", v)}
				/>
				<NumberInput
					min={1}
					max={100}
					label="HP%"
					tooltip="Character's HP percentage"
					value={env.percentHp}
					changeValue={v => changeEnv("percentHp", v)}
				/>
				<NumberInput
					min={1}
					max={99}
					label="C. Lvl"
					tooltip="Character's level"
					value={env.level}
					changeValue={v => changeEnv("level", v)}
				/>
				<NumberInput
					min={1}
					max={99}
					label="T. Lvl"
					tooltip="Target's level"
					value={env.targetLevel}
					changeValue={v => changeEnv("targetLevel", v)}
				/>
				<NumberInput
					min={0}
					max={9}
					label="Time"
					tooltip="Ones digit of game clock minutes"
					value={env.minuteOnesDigit}
					changeValue={v => changeEnv("minuteOnesDigit", v)}
				/>
				<NumberInput
					min={100}
					max={50000}
					label="Party HP"
					tooltip="Combined Max HP of entire active party"
					value={env.partyMaxHp}
					changeValue={v => changeEnv("partyMaxHp", v)}
				/>
				<NumberInput
					min={0}
					max={40}
					label="Block"
					tooltip="Target's block (EVA)"
					value={env.block}
					changeValue={v => changeEnv("block", v)}
				/>
				<WeatherInput
					label="Weather"
					tooltip="What is the current weather?"
					value={env.weather}
					changeValue={v => changeEnv("weather", v)}
				/>
				<TerrainInput
					label="Terrain"
					tooltip="What is the current terrain?"
					value={env.terrain}
					changeValue={v => changeEnv("terrain", v)}
				/>
				<br />
				<BoolInput
					label="Resist G&M"
					tooltip="Does the target resist guns and measures?"
					value={env.resistGun}
					changeValue={v => changeEnv("resistGun", v)}
				/>
				{/* battle speed... (dropdown?) */}
				<BoolInput
					label="Berserk"
					tooltip="Is the berserk buff available?"
					value={env.berserk}
					changeValue={v => changeEnv("berserk", v)}
				/>
				<BoolInput
					label="Haste"
					tooltip="Is the haste buff available?"
					value={env.haste}
					changeValue={v => changeEnv("haste", v)}
				/>
				<BoolInput
					label="Bravery"
					tooltip="Is the bravery buff available?"
					value={env.bravery}
					changeValue={v => changeEnv("bravery", v)}
				/>
				<BoolInput
					label="Faith"
					tooltip="Is the faith buff available?"
					value={env.faith}
					changeValue={v => changeEnv("faith", v)}
				/>
				<BoolInput
					label="Oil"
					tooltip="Is the target oiled?"
					value={env.oil}
					changeValue={v => changeEnv("oil", v)}
				/>
				<BoolInput
					label="Parry"
					tooltip="Can the target parry attacks?"
					value={env.parry}
					changeValue={v => changeEnv("parry", v)}
				/>
				<BoolInput
					label="Undead"
					tooltip="Is the target undead?"
					value={env.undead}
					changeValue={v => changeEnv("undead", v)}
				/>
				<BoolInput
					label="All Licenses"
					tooltip="Allow grey-shaded licenses"
					value={env.allowCertainLicenses}
					changeValue={v => changeEnv("allowCertainLicenses", v)}
				/>
				<BoolInput
					label="Secret Gear"
					tooltip="Allow secret items"
					value={env.allowCheaterGear}
					changeValue={v => changeEnv("allowCheaterGear", v)}
				/>
				<br />
				{AllElements.map(s => <ElementInput
					label={s[0].toUpperCase() + s.slice(1)}
					tooltip={`How much ${s} damage does the target take?`}
					value={env[`${s}Reaction` as const]}
					changeValue={v => changeEnv(`${s}Reaction` as const, v)}
				/>)}
			</div>
			<PartyDps party={props.party} env={env} />
		</div>;
	};
}
export default DPS;

function EqCell(props: { value?: Equipment }) {
	const { value } = props;
	return <td
		aria-label={value?.tooltip}
	>
		{value && value.name}
	</td>;
}

function AbilityCell(props: { value: Ability }) {
	const { value } = props;
	return <td
		aria-label={value.text}
	>
		{value.name}
	</td>;
}

function DpsCell(props: { value: CalculateResult }) {
	const { value } = props;
	const label = `Base Damage: ${Math.round(value.baseDmg)}
Modified Damage: ${Math.round(value.modifiedDamage)}
Not Avoided Damage:  ${Math.round(value.nonAvoidedDamage)}
Comboed Damage: ${Math.round(value.comboDamage)}
Charge Time: ${value.chargeTime.toFixed(2)}s
Animation Time: ${value.animationTime.toFixed(2)}s`;
	return <td
		class="r"
		aria-label={label}
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

function renderComponents(results: PartyDpsState["results"]) {
	return results
		? results.map((result, idx) => <SingleCharacterDps name={Characters[idx].name} results={result} />)
		: <tr><td>Working...</td></tr>;
}

const PartyDps: TPC<PartyDpsProps> = (props, instance) => {
	let state: PartyDpsState = { results: undefined, for: undefined };

	async function checkForCalculate() {
		const results: OptimizerResult[][] = [[], [], [], [], [], []];
		const { party, env } = props;

		let time = performance.now();

		for (let i = 0; i < 6; i++) {
			const dest = results[i];
			const characterEnv = { ...env, character: i };
			for (const r of optimizeForCharacter(characterEnv, party)) {
				if (performance.now() - time > 120) {
					// Interrupt processing to aid responsiveness
					await new Promise(r => setTimeout(r, 0));
					time = performance.now();
					if (party !== props.party || env !== props.env) {
						// stop processing now if this data is already old
						return;
					}
				}
				dest.push(r);
			}
			dest.sort((a, b) => b.dps.dps - a.dps.dps);
		}

		state = {
			results,
			for: {
				party,
				env
			}
		};
		scheduleUpdate(instance);
	}

	const components = createSelector(() => state.results, renderComponents);

	return nextProps => {
		props = nextProps;

		const same = state.for && state.for.env === props.env && state.for.party === props.party;
		effect(instance, () => {
			if (!same) {
				checkForCalculate();
			}
		});
	
		return <div class={same ? "results" : "results busy"}>
			<table>
				<tbody>
					{components()}
				</tbody>
			</table>	
		</div>;
	};
}

function SingleCharacterDps(props: { name: string, results: OptimizerResult[] }) {
	return <>
		<tr class="sticky">
			<th colSpan={9999}>{props.name}</th>
		</tr>
		<tr class="sticky second-row">
			<th class="r">DPS</th>
			<th>Ability</th>
			<th>Weapon</th>
			<th>Ammo</th>
			<th>Helm</th>
			<th>Armor</th>
			<th>Accessory</th>
		</tr>

		{props.results.map(r => <tr class="data-row">
			<DpsCell value={r.dps} />
			<AbilityCell value={r.ability} />
			<EqCell value={r.doll.weapon} />
			<EqCell value={r.doll.ammo} />
			<EqCell value={r.doll.helm} />
			<EqCell value={r.doll.armor} />
			<EqCell value={r.doll.accessory} />
		</tr>)}
	</>;
}
