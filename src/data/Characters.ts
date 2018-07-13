import { License, LicenseByName } from "./Licenses";

export interface Character {
	name: string;
	innateLicenses: License[];
}

export const Characters: Character[] = [
	{
		name: "Vaan",
		innateLicenses: ["Essentials", "Steal", "Daggers 1", "Light Armor 1"].map(LicenseByName)
	},
	{
		name: "Balthier",
		innateLicenses: ["Essentials", "Steal", "First Aid", "Guns 1", "Light Armor 2"].map(LicenseByName)
	},
	{
		name: "Fran",
		innateLicenses: ["Essentials", "White Magick 1", "Black Magick 1", "Steal", "Bows 1", "Light Armor 2"].map(LicenseByName)
	},
	{
		name: "Basch",
		innateLicenses: ["Essentials", "Libra", "Swords 2", "Shields 1", "Heavy Armor 1"].map(LicenseByName)
	},
	{
		name: "Ashe",
		innateLicenses: ["Essentials", "White Magick 1", "Swords 2", "Shields 1", "Heavy Armor 1", "Accessories 2"].map(LicenseByName)
	},
	{
		name: "Penelo",
		innateLicenses: ["Essentials", "White Magick 1", "First Aid", "Daggers 1", "Mystic Armor 1"].map(LicenseByName)
	}	
];
