import Weapon from "./equip/Weapon.ts";
import Ammos from "./equip/Ammo.ts";
import { Helm, BodyArmor } from "./equip/Armor.ts";
import Accessory from "./equip/Accessory.ts";
import Magicks from "./ability/Magick.ts";
import Technicks from "./ability/Technick.ts";
import { LicenseByName, LicenseGroups } from "../data/Licenses.ts";
import { BaseCharacterStats } from "./BaseCharacterStats.ts";
import { Weapon as PS2Weapon } from "./ps2/Weapon.ts";
import { Ammos as PS2Ammos } from "./ps2/Ammo.ts";
import { Helm as PS2Helm, BodyArmor as PS2BodyArmor } from "./ps2/Armor.ts";
import { Accessory as PS2Accessory } from "./ps2/Accessory.ts";
import { Magicks as PS2Magicks } from "./ps2/Magick.ts";
import { Technicks as PS2Technicks } from "./ps2/Technick.ts";
import { PS2LicenseByName, PS2LicenseGroups } from "../data/PS2Licenses.ts";
import { BaseCharacterStats as PS2BaseCharacterStats } from "./ps2/BaseCharacterStats.ts";

const zodiac = { Weapon, Ammos, Helm, BodyArmor, Accessory, Magicks, Technicks, LicenseByName, LicenseGroups, BaseCharacterStats };
const original = {
	Weapon: PS2Weapon, Ammos: PS2Ammos, Helm: PS2Helm, BodyArmor: PS2BodyArmor, Accessory: PS2Accessory,
	Magicks: PS2Magicks, Technicks: PS2Technicks, LicenseByName: PS2LicenseByName,
	LicenseGroups: PS2LicenseGroups, BaseCharacterStats: PS2BaseCharacterStats,
};

/** Select complete, independent catalogs; matching names do not imply matching values. */
export const dpsData = (ps2: boolean) => ps2 ? original : zodiac;
