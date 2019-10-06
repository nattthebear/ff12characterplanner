import { Environment, Equipment, EquipmentPool, Profile } from "./Profile";
import PartyModel from "../model/PartyModel";
import Weapon from "./equip/Weapon";
import { BodyArmor, Helm } from "./equip/Armor";
import Accessory from "./equip/Accessory";
import { License, LicenseByName } from "../data/Licenses";
import { optimize } from "./Optimize";
import { BaseCharacterStats } from "./BaseCharacterStats";

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
		berserk: false,
		haste: false,
		bravery: false,
		focus: filterLName("Focus"),
		adrenaline: filterLName("Adrenaline"),
		genjiGloves: false,

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

	const results = weapons
		.map(w => optimize(startingProfile, e, w, pool))
		.sort((a, b) => b.dps - a.dps);
	
	return results;
}
