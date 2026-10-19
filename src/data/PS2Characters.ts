import { PS2LicenseByName } from "./PS2Licenses.ts";

// Initial licenses, before spending LP; Piggyback, printed pages 62-67.
// Vaan's later tutorial grant of Accessories 1 is a story event, not an initial license.
export const PS2StartingLicenseNames = [
	["Steal", "Light Armor 1", "Smallswords"],
	["Steal", "First Aid", "Guns 1", "Guns 2", "Shields 1", "Light Armor 1", "Light Armor 2", "Heavy Armor 1"],
	["White Magick 1", "Black Magick 1", "Steal", "Bows 1", "Bows 2", "Shields 1", "Light Armor 1", "Light Armor 2", "Heavy Armor 1"],
	["Libra", "Smallswords", "Swords 1", "Axes & Hammers 1", "Shields 1", "Shields 2", "Light Armor 1", "Heavy Armor 1", "Heavy Armor 2", "Accessories 3"],
	["White Magick 1", "White Magick 2", "Swords 1", "Swords 2", "Shields 1", "Shields 2", "Light Armor 1", "Mystic Armor 1", "Heavy Armor 1", "Heavy Armor 2", "Accessories 1", "Accessories 2"],
	["White Magick 1", "Daggers 1", "Light Armor 1"],
];
export const PS2StartingLicenses = PS2StartingLicenseNames.map(names => names.map(PS2LicenseByName));
