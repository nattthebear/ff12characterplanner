import { License } from "../data/Licenses";
import { Ability } from "./ability/Ability";

export type DamageFormula =
	"unarmed" | "sword" | "pole" | "mace" | "katana"
	| "hammer" | "dagger" | "gun";

export type AnimationClass = "unarmed"
	| "dagger" | "ninja" | "katana" | "sword"
	| "bigsword" | "hammer" | "pole" | "spear" | "mace"
	| "bow" | "gun" | "xbow" | "measure" | "rod" | "staff" | "handbomb";

export const AllElements = ["fire", "ice", "lightning", "water", "wind", "earth", "dark", "holy"] as const;

export type ElementalReaction = 0 | 0.5 | 1 | 2;
export type Terrain = "other" | "sand" | "water" | "snow";
export type Weather = "other" | "windy" | "rainy" | "foggy" | "windy and rainy";

export interface Environment {
	/** character index, 0-5 */
	character: number;
	/** Target physical defense */
	def: number;
	/** Target magical defense */
	mdef: number;
	/** Number of foes */
	targetCount: number;
	/** character hp percentage, from 1 to 100 */
	percentHp: number;
	/** How much damage does the target take from the element? */
	fireReaction: ElementalReaction;
	/** How much damage does the target take from the element? */
	iceReaction: ElementalReaction;
	/** How much damage does the target take from the element? */
	lightningReaction: ElementalReaction;
	/** How much damage does the target take from the element? */
	waterReaction: ElementalReaction;
	/** How much damage does the target take from the element? */
	windReaction: ElementalReaction;
	/** How much damage does the target take from the element? */
	earthReaction: ElementalReaction;
	/** How much damage does the target take from the element? */
	darkReaction: ElementalReaction;
	/** How much damage does the target take from the element? */
	holyReaction: ElementalReaction;
	/** character level, 1-99 */
	level: number;
	/** True if target resists guns and measures */
	resistGun: boolean;
	/** slowest(1) to fastest(6) */
	battleSpeed: 1 | 2 | 3 | 4 | 5 | 6;
	/** true if the buff can be provided from external sources, and an accessory is not needed to provide it */
	berserk: boolean;
	/** true if the buff can be provided from external sources, and an accessory is not needed to provide it */
	haste: boolean;
	/** true if the buff can be provided from external sources, and an accessory is not needed to provide it */
	bravery: boolean;
	/** true if the buff can be provided from external sources, and an accessory is not needed to provide it */
	faith: boolean;
	/** True if the target can parry attacks.  If so, it's always 25% (30% when player is defending). */
	parry: boolean;
	/** Target's block chance.  Varies from 0% (the most common) to a max (?) of 40% (Flowering Cactoid). */
	block: number;
	/** What terrain are we fighting on? */
	terrain: Terrain;
	/** What is the weather? */
	weather: Weather;
	/** True if the target can be and is oiled. */
	oil: boolean;
	/** True if the target eats brains. */
	undead: boolean;
}

export const defaultEnvironment: Environment = {
	character: -1,
	def: 30,
	mdef: 30,
	targetCount: 1,
	percentHp: 1,
	fireReaction: 1,
	iceReaction: 1,
	lightningReaction: 1,
	waterReaction: 1,
	windReaction: 1,
	earthReaction: 1,
	darkReaction: 1,
	holyReaction: 1,
	level: 70,
	resistGun: false,
	battleSpeed: 6,
	berserk: true,
	haste: true,
	bravery: true,
	faith: true,
	parry: false,
	block: 0,
	terrain: "other",
	weather: "other",
	oil: false,
	undead: false,
};

export interface Profile {
	ability: Ability;
	damageType: DamageFormula;
	animationType: AnimationClass;
	/** Weapon attack value */
	attack: number;
	/** Weapon CB value */
	combo: number;
	/** Weapon CT value */
	chargeTime: number;
	/** character stat, max 99 */
	str: number;
	/** character stat, max 99 */
	mag: number;
	/** character stat, max 99 */
	vit: number;
	/** character stat, max 99 */
	spd: number;
	/** Is the brawler license available? */
	brawler: boolean;
	berserk: boolean;
	haste: boolean;
	bravery: boolean;
	faith: boolean;
	/** Is the focus license available? */
	focus: boolean;
	/** Is the adrenaline license available? */
	adrenaline: boolean;
	serenity: boolean;
	spellbreaker: boolean;

	genjiGloves: boolean;
	cameoBelt: boolean;
	agateRing: boolean;

	/** The 1st swiftness license */
	swiftness1: boolean;
	/** The 2nd swiftness license */
	swiftness2: boolean;
	/** The 3rd swiftness license */
	swiftness3: boolean;
	
	/** True if the weapon does damage with this element */
	fireDamage: boolean;
	/** True if the weapon does damage with this element */
	iceDamage: boolean;
	/** True if the weapon does damage with this element */
	lightningDamage: boolean;
	/** True if the weapon does damage with this element */
	waterDamage: boolean;
	/** True if the weapon does damage with this element */
	windDamage: boolean;
	/** True if the weapon does damage with this element */
	earthDamage: boolean;
	/** True if the weapon does damage with this element */
	darkDamage: boolean;
	/** True if the weapon does damage with this element */
	holyDamage: boolean;

	/** Is the 1.5x modfifier available? */
	fireBonus: boolean;
	/** Is the 1.5x modfifier available? */
	iceBonus: boolean;
	/** Is the 1.5x modfifier available? */
	lightningBonus: boolean;
	/** Is the 1.5x modfifier available? */
	waterBonus: boolean;
	/** Is the 1.5x modfifier available? */
	windBonus: boolean;
	/** Is the 1.5x modfifier available? */
	earthBonus: boolean;
	/** Is the 1.5x modfifier available? */
	darkBonus: boolean;
	/** Is the 1.5x modfifier available? */
	holyBonus: boolean;
}

export interface Equipment extends Partial<Profile> {
	name: string;
	l?: License;
	mutateProfile(p: Profile): void;
}

export interface Ammo extends Equipment {
	type: AnimationClass;
}

export interface PaperDoll {
	weapon: Equipment;
	ammo?: Ammo;
	helm?: Equipment;
	armor?: Equipment;
	accessory?: Equipment;
}

export function buildEquipments<T extends Equipment>(eqs: Omit<T, "mutateProfile">[]): T[] {
	for (const e of eqs) {
		buildMutator(e as T);
	}
	return eqs as T[];
}

function buildMutator(e: Equipment) {
	let s = "";
	for (const k in e) {
		if (k === "name" || k === "l" || k === "type") {
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
	e.mutateProfile = Function("ret", s) as any;
}

export function createProfile(startingProfile: Profile, doll: PaperDoll) {
	const ret = { ...startingProfile };
	doll.weapon.mutateProfile(ret);
	doll.ammo?.mutateProfile(ret);
	doll.helm?.mutateProfile(ret);
	doll.armor?.mutateProfile(ret);
	doll.accessory?.mutateProfile(ret);
	if (ret.str > 99) {
		ret.str = 99;
	}
	if (ret.mag > 99) {
		ret.mag = 99;
	}
	if (ret.vit > 99) {
		ret.vit = 99;
	}
	if (ret.spd > 99) {
		ret.spd = 99;
	}
	return ret;
}

/** The items available to a particular character to equip */
export interface EquipmentPool {
	weapons: Equipment[];
	armors: Equipment[];
	helms: Equipment[];
	accessories: Equipment[];
}
