import { Environment, EquipmentPool, Profile } from "./Profile";
import PartyModel, { Coloring } from "../model/PartyModel";
import Weapon from "./equip/Weapon";
import Ammos from "./equip/Ammo";
import { BodyArmor, Helm } from "./equip/Armor";
import Accessory from "./equip/Accessory";
import { License, LicenseByName, LicenseGroups } from "../data/Licenses";
import { optimize } from "./Optimize";
import { BaseCharacterStats } from "./BaseCharacterStats";
import { Ability, Attack } from "./ability/Ability";
import type { Equipment } from "./equip/Equipment";
import Magicks from "./ability/Magick";
import Technicks from "./ability/Technick";

const battleLores = LicenseGroups.find(g => g.name === "Battle Lore")!.contents;
const magickLores = LicenseGroups.find(g => g.name === "Magick Lore")!.contents;

export interface ForcedGear {
	/** Restrict results to this ability kind. */
	ability?: Ability["alg"];
	/** null means explicitly no equipment in this slot */
	ammos?: Equipment | null;
	armors?: Equipment | null;
	helms?: Equipment | null;
	accessories?: Equipment | null;
}

export function* optimizeForCharacter(e: Environment, party: PartyModel, forced?: ForcedGear) {
	const licenseMap = party.color(e.character);

	function filterLName(name: string) {
		return filterL(LicenseByName(name));
	}
	function filterL(l: License) {
		const v = licenseMap.get(l);
		return v === Coloring.OBTAINED || e.allowCertainLicenses && v === Coloring.CERTAIN;
	}
	function filterThing(thing: { l?: License }) {
		return !thing.l || filterL(thing.l);
	}

	let weapons = Weapon.filter(w => filterThing(w) && (e.allowCheaterGear || w.attack! <= 150));
	if (forced?.ammos === null) {
		// 'None' ammo: weapons that need ammo (bow/xbow/gun/handbomb) can't be used
		const requiresAmmo = new Set(Ammos.map(a => a.animationType));
		weapons = weapons.filter(w => !requiresAmmo.has(w.animationType));
	}
	const pool: EquipmentPool = {
		weapons,
		ammos: forced?.ammos === null ? [] : forced?.ammos ? [forced.ammos] : undefined,
		armors: forced?.armors === null ? [] : forced?.armors ? [forced.armors] : BodyArmor.filter(filterThing),
		helms: forced?.helms === null ? [] : forced?.helms ? [forced.helms] : Helm.filter(filterThing),
		accessories: forced?.accessories === null ? [] : forced?.accessories ? [forced.accessories] : Accessory.filter(filterThing)
	};
	const magicks = Magicks.filter(filterThing);
	const technicks = Technicks.filter(filterThing);

	const startingProfile: Profile = {
		ability: Attack,
		damageType: "unarmed",
		animationType: "unarmed",
		attack: 0,
		combo: 0,
		chargeTime: 0,
		...BaseCharacterStats(e.character, e.level),
		brawler: filterLName("Brawler"),
		berserk: e.berserk,
		haste: e.haste,
		bravery: e.bravery,
		faith: e.faith,
		focus: filterLName("Focus"),
		adrenaline: filterLName("Adrenaline"),
		serenity: filterLName("Serenity"),
		spellbreaker: filterLName("Spellbreaker"),
		genjiGloves: false,
		cameoBelt: false,
		agateRing: false,

		swiftness1: filterLName("Swiftness 1"),
		swiftness2: filterLName("Swiftness 2"),
		swiftness3: filterLName("Swiftness 3"),
		
		fireDamage: false,
		iceDamage: false,
		lightningDamage: false,
		waterDamage: false,
		windDamage: false,
		earthDamage: false,
		darkDamage: false,
		holyDamage: false,

		fireBonus: false,
		iceBonus: false,
		lightningBonus: false,
		waterBonus: false,
		windBonus: false,
		earthBonus: false,
		darkBonus: false,
		holyBonus: false,
	};
	startingProfile.str += battleLores.filter(filterL).length;
	startingProfile.mag += magickLores.filter(filterL).length;

	if (!forced?.ability || forced.ability === "magick") {
		for (const m of magicks) {
			startingProfile.ability = m;
			yield optimize(startingProfile, e, pool);
		}
	}
	if (!forced?.ability || forced.ability === "technick") {
		for (const t of technicks) {
			startingProfile.ability = t;
			yield optimize(startingProfile, e, pool);
		}
	}
	startingProfile.ability = Attack;
	pool.weapons = [];
	if (!forced?.ability || forced.ability === "attack") {
		for (const w of weapons) {
			pool.weapons[0] = w;
			yield optimize(startingProfile, e, pool);
		}
	}
}
