import { h, Fragment, TPC, scheduleUpdate } from "vdomk";
import PartyModel, { Coloring } from "../model/PartyModel";
import { optimizeForCharacter, ForcedGear } from "../dps/OptimizeForCharacter";
import { OptimizerResult } from "../dps/Optimize";
import { Characters } from "../data/Characters";
import "./Dps.css";
import { Environment, defaultEnvironment } from "../dps/Profile";
import { CalculateResult } from "../dps/Calculate";
import { makeStore } from "../store/MakeStore";
import { Ability } from "../dps/ability/Ability";
import { AllElements, Equipment } from "../dps/equip/Equipment";
import { BodyArmor, Helm } from "../dps/equip/Armor";
import Accessory from "../dps/equip/Accessory";
import Ammos from "../dps/equip/Ammo";
import Weapon from "../dps/equip/Weapon";
import { License } from "../data/Licenses";
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

interface Filters {
	ability: string;
	topN: string;
	ammo: string;
	helm: string;
	armor: string;
	accessory: string;
}

const defaultFilters = (): Filters => ({
	ability: "",
	topN: "5",
	ammo: "",
	helm: "",
	armor: "",
	accessory: "",
});

const ABILITY_OPTIONS: [string, string][] = [
	["", "All"],
	["attack", "Attack"],
	["magick", "Magic"],
	["technick", "Technick"],
];

const NO_EQUIP = "__none__";
// builds dropdown options: empty value = auto, "__none__" = no equipment, then the given items
const dropdownOptions = (items: string[]): [string, string][] => [
	["", "Auto"],
	[NO_EQUIP, "None"],
	...items.map(item => [item, item] as [string, string]),
];

interface CharacterOptions {
	ammos: string[];
	helms: string[];
	armors: string[];
	accessories: string[];
}

// Ribbon > Genji Gloves > higher Accessories tier first (rank 0 = best, 24 = worst)
function accessoryRank(accessory: Equipment): number {
	const name = accessory.l?.fullName;
	if (name === "Ribbon") {
		return 0;
	}
	if (accessory.name === "Genji Gloves") {
		return 1;
	}
	const m = /^Accessories (\d+)$/.exec(name ?? "");
	return m ? 2 + (22 - +m[1]) : 24;
}

// dropdown lists: only equipment the character can actually equip (and ammo matching their weapons)
export function buildOptions(env: Environment, party: PartyModel, character: number): CharacterOptions {
	const licenseMap = party.color(character);
	const isActive = (license: License) => {
		const v = licenseMap.get(license);
		return v === Coloring.OBTAINED || env.allowCertainLicenses && v === Coloring.CERTAIN;
	};
	const SECRET_WEAPONS = new Set(["Seitengrat", "Great Trango", "Wyrmhero Blade"]);
	const isEquippable = (thing: { l?: License }) => !thing.l || isActive(thing.l);
	const weaponTypes = new Set(Weapon.filter(w => isEquippable(w) && !SECRET_WEAPONS.has(w.name)).map(w => w.animationType));
	const accessories = Accessory.filter(isEquippable);
	accessories.sort((a, b) => accessoryRank(a) - accessoryRank(b) || a.name.localeCompare(b.name));
	return {
		ammos: Ammos.filter(a => weaponTypes.has(a.animationType)).map(a => a.name),
		helms: Helm.filter(isEquippable).map(h => h.name).reverse(),
		armors: BodyArmor.filter(isEquippable).map(a => a.name).reverse(),
		accessories: accessories.map(a => a.name),
	};
}

// keep only results matching the chosen ability/helm/armor/accessory and the top-N limit
function applyFilters(results: OptimizerResult[], filters: Filters) {
	let list = results;
	if (filters.ability) {
		list = list.filter(r => r.ability.alg === filters.ability);
	}
	if (filters.helm) {
		list = list.filter(r => filters.helm === NO_EQUIP ? !r.doll.helm : r.doll.helm?.name === filters.helm);
	}
	if (filters.armor) {
		list = list.filter(r => filters.armor === NO_EQUIP ? !r.doll.armor : r.doll.armor?.name === filters.armor);
	}
	if (filters.accessory) {
		list = list.filter(r => filters.accessory === NO_EQUIP ? !r.doll.accessory : r.doll.accessory?.name === filters.accessory);
	}
	const topN = +filters.topN;
	if (topN) {
		list = list.slice(0, topN);
	}
	return list;
}

function Dropdown(props: { value: string; options: readonly (readonly [string, string])[]; onChange: (value: string) => void }) {
	return <select
		class="filter"
		value={props.value}
		onChange={ev => props.onChange(ev.currentTarget.value)}
	>
		{props.options.map(([value, label]) => <option value={value}>{label}</option>)}
	</select>;
}

interface PartyDpsProps {
	party: PartyModel;
	env: Environment;
}

interface PartyDpsState {
	results: OptimizerResult[][];
	for: (PartyDpsProps | undefined)[];
	/** The filters each character's results were computed with, so stale ones can be recomputed. */
	computedFilters: (Filters | undefined)[];
}

// one SingleCharacterDps row per character, constrained by the setFilter
function renderComponents(results: OptimizerResult[][], env: Environment, party: PartyModel, filters: Filters[], setFilter: (character: number, key: keyof Filters, value: string) => void) {
	return results.map((result, idx) => <SingleCharacterDps
		name={Characters[idx].name}
		results={result}
		filters={filters[idx]}
		setFilter={(key, value) => setFilter(idx, key, value)}
		options={buildOptions(env, party, idx)}
	/>);
}

// turn dropdown selections into the gear constraints the optimizer must respect
function forcedGear(filters: Filters, env: Environment, party: PartyModel, character: number): ForcedGear {
	const gear: ForcedGear = {};
	if (filters.ability) {
		gear.ability = filters.ability as Ability["alg"];
	}
	if (filters.ammo) {
		gear.ammos = Ammos.find(x => x.name === filters.ammo) ?? null;
	}
	if (filters.helm) {
		gear.helms = Helm.find(x => x.name === filters.helm) ?? null;
	}
	if (filters.armor) {
		gear.armors = BodyArmor.find(x => x.name === filters.armor) ?? null;
	}
	if (filters.accessory) {
		gear.accessories = Accessory.find(x => x.name === filters.accessory) ?? null;
	}
	return gear;
}

// stateful view: recomputes each character when their party/env/filters change
const PartyDps: TPC<PartyDpsProps> = (props, instance) => {
	let state: PartyDpsState = {
		results: Array.from({ length: 6 }, () => []),
		for: Array.from({ length: 6 }, () => undefined),
		computedFilters: Array.from({ length: 6 }, () => undefined),
	};
	let filters: Filters[] = Array.from({ length: 6 }, () => defaultFilters());
	const inflight = new Set<number>();

	// true when the stored result no longer matches the current party, env, or filters
	const charStale = (i: number) =>
		state.for[i]?.party !== props.party || state.for[i]?.env !== props.env || state.computedFilters[i] !== filters[i];

	// run the optimizer for one character, aborting and rescheduling if inputs changed mid-run
	async function calculate(i: number) {
		const { party, env } = props;
		const filter = filters[i];
		const characterEnv = { ...env, character: i };

		const dest: OptimizerResult[] = [];
		let time = performance.now();
		let wentAsync = false;

		for (const result of optimizeForCharacter(characterEnv, party, forcedGear(filter, characterEnv, party, i))) {
			if (performance.now() - time > 120) {
				// Interrupt processing to aid responsiveness
				await new Promise(resolve => setTimeout(resolve, 0));
				wentAsync = true;
				time = performance.now();
				if (party !== props.party || env !== props.env || filter !== filters[i]) {
					// stop processing now if this data is already old, and restart it
					inflight.delete(i);
					scheduleUpdate(instance);
					return;
				}
			}
			dest.push(result);
		}
		dest.sort((a, b) => b.dps.dps - a.dps.dps);
		inflight.delete(i);

		state = {
			...state,
			results: state.results.map((r, idx) => idx === i ? dest : r),
			for: state.for.map((f, idx) => idx === i ? { party, env } : f),
			computedFilters: state.computedFilters.map((f, idx) => idx === i ? filter : f),
		};
		if (wentAsync) {
			scheduleUpdate(instance);
		}
	}

	// record a new filter for one character and trigger a re-render/recompute
	const setFilter = (character: number, key: keyof Filters, value: string) => {
		filters = filters.map((f, i) => i === character ? { ...f, [key]: value } : f);
		scheduleUpdate(instance);
	};

	return nextProps => {
		props = nextProps;

		for (let i = 0; i < 6; i++) {
			if (charStale(i) && !inflight.has(i)) {
				inflight.add(i);
				calculate(i);
			}
		}

		const nodes = state.for.some(f => f)
			? renderComponents(state.results, props.env, props.party, filters, setFilter)
			: <tr><td>Working...</td></tr>;

		return <div class={state.for.some(f => f) ? "results" : "results busy"}>
			<table>
				<tbody>
					{nodes}
				</tbody>
			</table>
		</div>;
	};
}

interface SingleCharacterDpsProps {
	name: string;
	results: OptimizerResult[];
	filters: Filters;
	setFilter: (key: keyof Filters, value: string) => void;
	options: CharacterOptions;
}

// one character's DPS table: constrained by dropdown selections
function SingleCharacterDps(props: SingleCharacterDpsProps) {
	const { filters, options } = props;
	const list = applyFilters(props.results, filters);
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
		<tr class="sticky filter-row">
			<td />
			<td><Dropdown value={filters.ability} onChange={v => props.setFilter("ability", v)} options={ABILITY_OPTIONS} /></td>
			<td><input class="filter" type="number" min="0" max="100" value={filters.topN} onChange={ev => props.setFilter("topN", ev.currentTarget.value)} /></td>
			<td><Dropdown value={filters.ammo} onChange={v => props.setFilter("ammo", v)} options={dropdownOptions(options.ammos)} /></td>
			<td><Dropdown value={filters.helm} onChange={v => props.setFilter("helm", v)} options={dropdownOptions(options.helms)} /></td>
			<td><Dropdown value={filters.armor} onChange={v => props.setFilter("armor", v)} options={dropdownOptions(options.armors)} /></td>
			<td><Dropdown value={filters.accessory} onChange={v => props.setFilter("accessory", v)} options={dropdownOptions(options.accessories)} /></td>
		</tr>

		{list.map(({ ability, doll, dps }) => <tr class="data-row">
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
