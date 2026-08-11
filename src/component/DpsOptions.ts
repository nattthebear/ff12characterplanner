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

// dropdown lists: only equipment the character can actually equip (and ammo matching their weapons)
export function buildOptions(env: Environment, party: PartyModel, character: number): CharacterOptions {
	const licenseMap = party.color(character);
	const isActive = (license: License) => {
		const v = licenseMap.get(license);
		return v === Coloring.OBTAINED || env.allowCertainLicenses && v === Coloring.CERTAIN;
	};
	const SECRET_WEAPONS = new Set(["Seitengrat", "Great Trango", "Wyrmhero Blade"]);
	const isEquippable = (thing: { l?: License }) => !thing.l || isActive(thing.l);
	const weaponTypes = new Set(Weapon.filter(w => isEquippable(w) && (env.allowCheaterGear || !SECRET_WEAPONS.has(w.name))).map(w => w.animationType));
	const accessories = Accessory.filter(isEquippable);
	return {
		ammos: Ammos.filter(a => weaponTypes.has(a.animationType)).map(a => a.name),
		helms: Helm.filter(isEquippable).map(h => h.name).reverse(),
		armors: BodyArmor.filter(isEquippable).map(a => a.name).reverse(),
		accessories: accessories.map(a => a.name),
	};
}
