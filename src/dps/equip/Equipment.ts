import type { License } from "../../data/Licenses";
import type { AnimationClass, DamageFormula, Profile } from "../Profile";
import { Ability } from "../ability/Ability";

export const AllElements = ["fire", "ice", "lightning", "water", "wind", "earth", "dark", "holy"] as const;

/** Keys that can be found on non-weapons (or for magick/technick, any slot) that potentially have negative results. */
export const MASK_Hazard = 0x3ff;

export const KEY_fireDamage = 1 << 0;
export const KEY_iceDamage = 1 << 1;
export const KEY_lightningDamage = 1 << 2;
export const KEY_waterDamage = 1 << 3;
export const KEY_windDamage = 1 << 4;
export const KEY_earthDamage = 1 << 5;
export const KEY_darkDamage = 1 << 6;
export const KEY_holyDamage = 1 << 7; // Can't actually be found on non-weapons, but less confusing to leave it here

export const KEY_agateRing = 1 << 8;
export const KEY_animationType = 1 << 9; // Telekinesis

/**
 * Keys that can be found on non-weapons (or for magick/technick, any slot) that impact DPS and are never negative.
 * Additionally, no more than one item per slot has them.
 */
export const MASK_Unique = 0x1ffc00;

export const KEY_brawler = 1 << 10;
export const KEY_berserk = 1 << 11;
export const KEY_haste = 1 << 12;
export const KEY_bravery = 1 << 13;
export const KEY_faith = 1 << 14;
export const KEY_focus = 1 << 15;
export const KEY_adrenaline = 1 << 16;
export const KEY_serenity = 1 << 17;
export const KEY_spellbreaker = 1 << 18;

export const KEY_genjiGloves = 1 << 19;
export const KEY_cameoBelt = 1 << 20;


/**
 * Keys that can be found on non-weapons (or for magick/technick, any slot) that impact DPS and are never negative.
 * Additionally, many items may have them and we have to compare their values to eliminate worse items.
 */
export const MASK_Shared = 0x1fff;

export const SKEY_attack = 1 << 0;
export const SKEY_str = 1 << 1;
export const SKEY_mag = 1 << 2;
export const SKEY_vit = 1 << 3;
export const SKEY_spd = 1 << 4;

export const SKEY_fireBonus = 1 << 5;
export const SKEY_iceBonus = 1 << 6;
export const SKEY_lightningBonus = 1 << 7;
export const SKEY_waterBonus = 1 << 8;
export const SKEY_windBonus = 1 << 9;
export const SKEY_earthBonus = 1 << 10;
export const SKEY_darkBonus = 1 << 11;
export const SKEY_holyBonus = 1 << 12;

const hazardUniqueMap = {
	// hazard
	fireDamage: KEY_fireDamage,
	iceDamage: KEY_iceDamage,
	lightningDamage: KEY_lightningDamage,
	waterDamage: KEY_waterDamage,
	windDamage: KEY_windDamage,
	earthDamage: KEY_earthDamage,
	darkDamage: KEY_darkDamage,
	holyDamage: KEY_holyDamage,

	agateRing: KEY_agateRing,
	animationType: KEY_animationType,

	// unique
	brawler: KEY_brawler,
	berserk: KEY_berserk,
	haste: KEY_haste,
	bravery: KEY_bravery,
	faith: KEY_faith,
	focus: KEY_focus,
	adrenaline: KEY_adrenaline,
	serenity: KEY_serenity,
	spellbreaker: KEY_spellbreaker,

	genjiGloves: KEY_genjiGloves,
	cameoBelt: KEY_cameoBelt,
} satisfies Partial<Record<keyof Profile, number>> & Record<string, number>;

const sharedMap = {
	attack: SKEY_attack,
	str: SKEY_str,
	mag: SKEY_mag,
	vit: SKEY_vit,
	spd: SKEY_spd,

	fireBonus: SKEY_fireBonus,
	iceBonus: SKEY_iceBonus,
	lightningBonus: SKEY_lightningBonus,
	waterBonus: SKEY_waterBonus,
	windBonus: SKEY_windBonus,
	earthBonus: SKEY_earthBonus,
	darkBonus: SKEY_darkBonus,
	holyBonus: SKEY_holyBonus,
} satisfies Partial<Record<keyof Profile, number>> & Record<string, number>;

export const LENGTH_Shared = Object.keys(sharedMap).length;

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

export class Equipment implements Partial<Profile> {
	constructor(input: Partial<Profile> & { name: string, l?: License }, isAmmo: boolean) {
		Object.assign(this, input);

		this.mutateProfile = buildMutator(input, isAmmo);
		this.tooltip = buildTooltip(input, isAmmo);

		for (const key in input) {
			let v: number;
			if ((v = (hazardUniqueMap as any)[key]) != null) {
				if (!isAmmo || key !== "animationType") {
					this.hazardUniqueMask |= v;
				}
			}
			if ((v = (sharedMap as any)[key]) != null) {
				this.sharedMask |= v;
			}
		}
		let i = 0;
		for (const key in sharedMap) {
			this.sharedValues[i++] = +((input as any)[key] ?? 0);
		}
	}

	name!: string;
	l?: License;
	mutateProfile: (p: Profile) => void;
	tooltip: string;

	hazardUniqueMask: number = 0;
	sharedMask: number = 0;
	sharedValues: number[] = [];

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
