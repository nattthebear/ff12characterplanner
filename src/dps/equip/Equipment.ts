import type { License } from "../../data/Licenses";
import type { AnimationClass, DamageFormula, Profile } from "../Profile";
import { Ability } from "../ability/Ability";

export const AllElements = ["fire", "ice", "lightning", "water", "wind", "earth", "dark", "holy"] as const;

/** Keys that can be found on non-weapons (or for magick/technick, any slot) that potentially have negative results. */
const HazardKeys = [
	"fireDamage",
	"iceDamage",
	"lightningDamage",
	"waterDamage",
	"windDamage",
	"earthDamage",
	"darkDamage",
	"holyDamage", // Can't actually be found on non-weapons, but less confusing to leave it here

	"agateRing",
	"animationType", // Telekinesis
] as const satisfies readonly (keyof Profile)[];
/** Keys that can be found on non-weapons (or for magick/technick, any slot) that impact DPS and are never negative */
const BenefitKeys = [
	// "ability",
	// "damageType",
	"attack",
	// "combo",
	// "chargeTime",
	"str",
	"mag",
	"vit",
	"spd",
	"brawler",
	"berserk",
	"haste",
	"bravery",
	"faith",
	"focus",
	"adrenaline",
	"serenity",
	"spellbreaker",

	"genjiGloves",
	"cameoBelt",

	// "swiftness1",
	// "swiftness2",
	// "swiftness3",

	"fireBonus",
	"iceBonus",
	"lightningBonus",
	"waterBonus",
	"windBonus",
	"earthBonus",
	"darkBonus",
	"holyBonus",
] as const satisfies readonly (keyof Profile)[];

export type HazardKey = typeof HazardKeys[number];
export type BenefitKey = typeof BenefitKeys[number];
export type OptimizerKey = HazardKey | BenefitKey;

function buildMutator(e: Partial<Profile>, isAmmo: boolean) {
	let s = "";
	for (const k in e) {
		if (k === "name" || k === "l" || k === "animationType" && isAmmo) {
			continue;
		}
		const v = (e as any)[k];
		if (typeof v === "boolean" && v) {
			s += `ret.${k} = true;\n`;
		} else if (typeof v === "number") {
			s += `ret.${k} += ${v};\n`;
		} else if (typeof v === "string") {
			s += `ret.${k} = ${JSON.stringify(v)};\n`;
		} else {
			throw new Error(`Unexpected type on Profile[${k}]: ${typeof v}`);
		}
	}
	return Function("ret", s) as Equipment["mutateProfile"];
}

function buildTooltip(e: Partial<Profile>, isAmmo: boolean) {
	const ret = Array<string>();
	if (!isAmmo && e.animationType) {
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
	f("faith", "Faith");
	f("focus", "Focus");
	f("adrenaline", "Adrenaline");
	f("serenity", "Serenity");
	f("spellbreaker", "Spellbreaker");
	f("genjiGloves", "Combo+");
	f("cameoBelt", "Ignore Evasion");
	f("agateRing", "Ignore Weather");
	for (const elt of AllElements) {
		f(`${elt}Damage` as const, elt[0].toUpperCase() + elt.slice(1) + " Damage");
	}
	for (const elt of AllElements) {
		f(`${elt}Bonus` as const, elt[0].toUpperCase() + elt.slice(1) + " Bonus");
	}
	return ret.join(",");
}

function buildHazardKeys(e: Partial<Profile>, isAmmo: boolean) {
	return new Set(
		HazardKeys.filter(key => (!isAmmo || key !== "animationType") && e[key] != null)
	);
}

function buildBenefitKeys(e: Partial<Profile>) {
	return new Map(
		(
			BenefitKeys
				.map<[BenefitKey, number | boolean | undefined]>(key => [key, e[key]])
				.filter(([, v]) => v != null)
				.map<[BenefitKey, number]>(([k, v]) => [k, +v!])
		) as [BenefitKey, number][]
	)
}

export class Equipment implements Partial<Profile> {
	constructor(input: Partial<Profile> & { name: string, l?: License }, isAmmo: boolean) {
		Object.assign(this, input);

		this.mutateProfile = buildMutator(input, isAmmo);
		this.tooltip = buildTooltip(input, isAmmo);
		this.benefitMap = buildBenefitKeys(input);
		this.hazardKeys = buildHazardKeys(input, isAmmo);
	}

	name!: string;
	l?: License;
	mutateProfile: (p: Profile) => void;
	tooltip: string;

	/** Each benefit key that exists with its associated numerical value */
	benefitMap: Map<BenefitKey, number>
	hazardKeys: Set<HazardKey>

	ability?: Ability;
	damageType?: DamageFormula;
	animationType?: AnimationClass;
	/** Weapon attack value */
	attack?: number;
	/** Weapon CB value */
	combo?: number;
	/** Weapon CT value */
	chargeTime?: number;
	/** character stat, max 99 */
	str?: number;
	/** character stat, max 99 */
	mag?: number;
	/** character stat, max 99 */
	vit?: number;
	/** character stat, max 99 */
	spd?: number;
	/** Is the brawler license available? */
	brawler?: boolean;
	berserk?: boolean;
	haste?: boolean;
	bravery?: boolean;
	faith?: boolean;
	/** Is the focus license available? */
	focus?: boolean;
	/** Is the adrenaline license available? */
	adrenaline?: boolean;
	serenity?: boolean;
	spellbreaker?: boolean;

	genjiGloves?: boolean;
	cameoBelt?: boolean;
	agateRing?: boolean;

	/** The 1st swiftness license */
	swiftness1?: boolean;
	/** The 2nd swiftness license */
	swiftness2?: boolean;
	/** The 3rd swiftness license */
	swiftness3?: boolean;
	
	/** True if the weapon does damage with this element */
	fireDamage?: boolean;
	/** True if the weapon does damage with this element */
	iceDamage?: boolean;
	/** True if the weapon does damage with this element */
	lightningDamage?: boolean;
	/** True if the weapon does damage with this element */
	waterDamage?: boolean;
	/** True if the weapon does damage with this element */
	windDamage?: boolean;
	/** True if the weapon does damage with this element */
	earthDamage?: boolean;
	/** True if the weapon does damage with this element */
	darkDamage?: boolean;
	/** True if the weapon does damage with this element */
	holyDamage?: boolean;

	/** Is the 1.5x modfifier available? */
	fireBonus?: boolean;
	/** Is the 1.5x modfifier available? */
	iceBonus?: boolean;
	/** Is the 1.5x modfifier available? */
	lightningBonus?: boolean;
	/** Is the 1.5x modfifier available? */
	waterBonus?: boolean;
	/** Is the 1.5x modfifier available? */
	windBonus?: boolean;
	/** Is the 1.5x modfifier available? */
	earthBonus?: boolean;
	/** Is the 1.5x modfifier available? */
	darkBonus?: boolean;
	/** Is the 1.5x modfifier available? */
	holyBonus?: boolean;
}

export const buildEquipments = (data: (Partial<Profile> & { name: string, l?: License })[], isAmmo?: boolean) =>
	data.map(datum => new Equipment(datum, !!isAmmo));
