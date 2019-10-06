import { Environment, Equipment, EquipmentPool, Profile } from "./Profile";
import PartyModel from "../model/PartyModel";
import Weapon from "./equip/Weapon";
import { BodyArmor, Helm } from "./equip/Armor";
import Accessory from "./equip/Accessory";
import { License, LicenseByName, LicenseGroups } from "../data/Licenses";
import { optimize } from "./Optimize";
import { BaseCharacterStats } from "./BaseCharacterStats";

const battleLores = LicenseGroups.find(g => g.name === "Battle Lore")!.contents;
const magickLores = LicenseGroups.find(g => g.name === "Magick Lore")!.contents;

export function optimizeForCharacter(e: Environment, party: PartyModel) {
	const licenseMap = party.colorEx(e.character);

	function filterLName(name: string) {
		return filterL(LicenseByName(name));
	}
	function filterL(l: License) {
		return licenseMap.obtained.has(l) || licenseMap.certain.has(l);
	}
	function filterEq(item: Equipment) {
		return !item.l || filterL(item.l);
	}

	const weapons = Weapon.filter(filterEq);
	const pool: EquipmentPool = {
		armors: BodyArmor.filter(filterEq),
		helms: Helm.filter(filterEq),
		accessories: Accessory.filter(filterEq)
	};

	// TODO: str/mag/vit/spd
	const startingProfile: Profile = {
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
		focus: filterLName("Focus"),
		adrenaline: filterLName("Adrenaline"),
		genjiGloves: false,

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

	const results = weapons
		.map(w => optimize(startingProfile, e, w, pool))
		.sort((a, b) => b.dps - a.dps);
	
	return results;
}
