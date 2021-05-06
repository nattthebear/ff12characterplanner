import { Environment, Equipment, EquipmentPool, Profile } from "./Profile";
import PartyModel, { Coloring } from "../model/PartyModel";
import Weapon from "./equip/Weapon";
import { BodyArmor, Helm } from "./equip/Armor";
import Accessory from "./equip/Accessory";
import { License, LicenseByName, LicenseGroups } from "../data/Licenses";
import { optimize } from "./Optimize";
import { BaseCharacterStats } from "./BaseCharacterStats";
import { Attack } from "./ability/Ability";
import Magicks from "./ability/Magick";
import Technicks from "./ability/Technick";

const battleLores = LicenseGroups.find(g => g.name === "Battle Lore")!.contents;
const magickLores = LicenseGroups.find(g => g.name === "Magick Lore")!.contents;

export function* optimizeForCharacter(e: Environment, party: PartyModel) {
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

	const weapons = Weapon.filter(w => filterThing(w) && (e.allowCheaterGear || w.attack! <= 150));
	const pool: EquipmentPool = {
		weapons,
		armors: BodyArmor.filter(filterThing),
		helms: Helm.filter(filterThing),
		accessories: Accessory.filter(filterThing)
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

	for (const m of magicks) {
		startingProfile.ability = m;
		yield optimize(startingProfile, e, pool);
	}
	for (const t of technicks) {
		startingProfile.ability = t;
		yield optimize(startingProfile, e, pool);
	}
	startingProfile.ability = Attack;
	pool.weapons = [];
	for (const w of weapons) {
		pool.weapons[0] = w;
		yield optimize(startingProfile, e, pool);
	}
}
