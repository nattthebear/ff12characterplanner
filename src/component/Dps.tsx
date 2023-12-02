import { h, Fragment, TPC, scheduleUpdate, VNode } from "vdomk";
import PartyModel from "../model/PartyModel";
import { optimizeForCharacter } from "../dps/OptimizeForCharacter";
import { OptimizerResult } from "../dps/Optimize";
import { Characters } from "../data/Characters";
import "./Dps.css";
import { Environment, defaultEnvironment } from "../dps/Profile";
import { CalculateResult } from "../dps/Calculate";
import { makeStore } from "../store/MakeStore";
import { Ability } from "../dps/ability/Ability";
import { AllElements, Equipment } from "../dps/equip/Equipment";
import { BoolInput, ElementInput, NumberInput, TerrainInput, WeatherInput } from "./Dps.Inputs";

export interface Props {
	party: PartyModel;
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
		{value?.name}
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
	nodes: VNode;
}

function renderComponents(results: NonNullable<PartyDpsState["results"]>) {
	return results.map((result, idx) => <SingleCharacterDps name={Characters[idx].name} results={result} />);
}

const PartyDps: TPC<PartyDpsProps> = (props, instance) => {
	let state: PartyDpsState = {
		results: undefined,
		for: undefined,
		nodes: <tr><td>Working...</td></tr>
	};

	const notStale = () => state.for && state.for.env === props.env && state.for.party === props.party;

	async function calculate() {
		const results: OptimizerResult[][] = [[], [], [], [], [], []];
		const { party, env } = props;

		let time = performance.now();
		let wentAsync = false;

		for (let i = 0; i < 6; i++) {
			const dest = results[i];
			const characterEnv = { ...env, character: i };
			for (const result of optimizeForCharacter(characterEnv, party)) {
				if (performance.now() - time > 120) {
					// Interrupt processing to aid responsiveness
					await new Promise(resolve => setTimeout(resolve, 0));
					wentAsync = true;
					time = performance.now();
					if (party !== props.party || env !== props.env) {
						// stop processing now if this data is already old
						return;
					}
				}
				dest.push(result);
			}
			dest.sort((a, b) => b.dps.dps - a.dps.dps);
		}

		state = {
			results,
			for: {
				party,
				env
			},
			nodes: renderComponents(results),
		};
		if (wentAsync) {
			scheduleUpdate(instance);
		}
	}

	return nextProps => {
		props = nextProps;

		if (!notStale()) {
			calculate();
		}

		return <div class={notStale() ? "results" : "results busy"}>
			<table>
				<tbody>
					{state.nodes}
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

		{props.results.map(({ ability, doll, dps }) => <tr class="data-row">
			<DpsCell value={dps} />
			<AbilityCell value={ability} />
			<EqCell value={doll.weapon} />
			<EqCell value={doll.ammo} />
			<EqCell value={doll.helm} />
			<EqCell value={doll.armor} />
			<EqCell value={doll.accessory} />
		</tr>)}
	</>;
}
