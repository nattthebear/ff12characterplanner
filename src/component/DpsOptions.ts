import type { Environment } from "../dps/Profile.ts";
import PartyModel, { Coloring } from "../model/PartyModel.ts";
import Weapon from "../dps/equip/Weapon.ts";
import Accessory from "../dps/equip/Accessory.ts";
import Ammos from "../dps/equip/Ammo.ts";
import { Helm, BodyArmor } from "../dps/equip/Armor.ts";
import type { Equipment } from "../dps/equip/Equipment.ts";
import type { License } from "../data/Licenses.ts";

export interface CharacterOptions {
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
