import { Environment, Equipment, EquipmentPool, Profile } from "./Profile";
import PartyModel, { Coloring } from "../model/PartyModel";
import Weapon from "./equip/Weapon";
import { BodyArmor, Helm } from "./equip/Armor";
import Accessory from "./equip/Accessory";
import { License, LicenseByName, LicenseGroups } from "../data/Licenses";
import { optimize } from "./Optimize";
import { BaseCharacterStats } from "./BaseCharacterStats";
import { markTime, shouldTurn, turn } from "./PerfUtils";

const battleLores = LicenseGroups.find(g => g.name === "Battle Lore")!.contents;
const magickLores = LicenseGroups.find(g => g.name === "Magick Lore")!.contents;

export async function* optimizeForCharacter(e: Environment, party: PartyModel) {
	const licenseMap = party.color(e.character);

	function filterLName(name: string) {
		return filterL(LicenseByName(name));
	}
	function filterL(l: License) {
		const v = licenseMap.get(l);
		return v === Coloring.OBTAINED || v === Coloring.CERTAIN;
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

	let p = markTime();

	for (const w of weapons) {
		yield optimize(startingProfile, e, w, pool);
		// halt processing every 50ms to aid responsiveness
		if (shouldTurn(p)) {
			await turn();
			p = markTime();
		}
	}
}
