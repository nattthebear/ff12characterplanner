import { License, LicenseByName } from "../../data/Licenses";

export interface Magick {
	name: string;
	license?: License;

	/** Charge Time constant */
	ct: number;
	/** Animation time in 1/30s */
	at: number;
	/** Extra hit time in 1/30se */
	aoe?: number;

	/** Magick attack stat */
	att: number;

	special?: "heal" | "drain";

	fireDamage?: boolean;
	iceDamage?: boolean;
	lightningDamage?: boolean;
	waterDamage?: boolean;
	windDamage?: boolean;
	earthDamage?: boolean;
	darkDamage?: boolean;
	holyDamage?: boolean;
}
const Magicks: Magick[] = [
	{ name: "Cure", license: LicenseByName("White Magick 1"), ct: 23, at: 111, att: 20, special: "heal", },
	{ name: "Cura", license: LicenseByName("White Magick 4"), ct: 23, at: 117, aoe: 30, att: 46, special: "heal", },
	{ name: "Curaga", license: LicenseByName("White Magick 6"), ct: 23, at: 144, att: 86, special: "heal", },
	{ name: "Curaja", license: LicenseByName("White Magick 9"), ct: 23, at: 114, aoe: 30, att: 120, special: "heal", },
	{ name: "Holy", license: LicenseByName("White Magick 11"), ct: 23, at: 227, att: 157, holyDamage: true, },

	{ name: "Fire", license: LicenseByName("Black Magick 1"), ct: 23, at: 75, att: 22, fireDamage: true, },
	{ name: "Fira", license: LicenseByName("Black Magick 5"), ct: 23, at: 75, aoe: 30, att: 67, fireDamage: true, },
	{ name: "Firaga", license: LicenseByName("Black Magick 9"), ct: 23, at: 75, aoe: 30, att: 120, fireDamage: true, },
	{ name: "Thunder", license: LicenseByName("Black Magick 1"), ct: 23, at: 75, att: 23, lightningDamage: true, },
	{ name: "Thundara", license: LicenseByName("Black Magick 6"), ct: 23, at: 84, aoe: 114, att: 68, lightningDamage: true, },
	{ name: "Thundaga", license: LicenseByName("Black Magick 9"), ct: 23, at: 96, aoe: 48, att: 122, lightningDamage: true, },
	{ name: "Blizzard", license: LicenseByName("Black Magick 2"), ct: 23, at: 102, att: 25, iceDamage: true, },
	{ name: "Blizzara", license: LicenseByName("Black Magick 6"), ct: 23, at: 102, aoe: 30, att: 70, iceDamage: true, },
	{ name: "Blizzaga", license: LicenseByName("Black Magick 10"), ct: 23, at: 105, aoe: 75, att: 125, iceDamage: true, },
	{ name: "Aero", license: LicenseByName("Black Magick 4"), ct: 23, at: 90, aoe: 24, att: 51, windDamage: true, },
	{ name: "Aeroga", license: LicenseByName("Black Magick 8"), ct: 23, at: 108, aoe: 36, att: 103, windDamage: true, },

	{ name: "Aqua", license: LicenseByName("Black Magick 3"), ct: 23, at: 153, att: 37, waterDamage: true, },
	{ name: "Bio", license: LicenseByName("Black Magick 7"), ct: 23, at: 106, aoe: 30, att: 67, },
	{ name: "Shock", license: LicenseByName("Black Magick 11"), ct: 23, at: 123, att: 133, },
	{ name: "Scourge", license: LicenseByName("Black Magick 12"), ct: 23, at: 117, aoe: 45, att: 142, },
	{ name: "Flare", license: LicenseByName("Black Magick 12"), ct: 23, at: 305, att: 163, },
	{ name: "Scathe", license: LicenseByName("Black Magick 13"), ct: 23, at: 218, aoe: 0, att: 190, },

	/* TODO
	{ name: "Balance", license: LicenseByName("Time Magick 3"), ct: 23, at: 0, aoe: 0, att: 0, },
	{ name: "Gravity", license: LicenseByName("Time Magick 4"), ct: 23, at: 0, aoe: 0, att: 0, },
	{ name: "Graviga", license: LicenseByName("Time Magick 10"), ct: 23, at: 0, aoe: 0, att: 0, },
	*/

	{ name: "Drain", license: LicenseByName("Green Magick 2"), ct: 23, at: 129, att: 62, special: "drain", },

	{ name: "Dark", license: LicenseByName("Arcane Magick 1"), ct: 23, at: 96, aoe: 30, att: 46, darkDamage: true, },
	{ name: "Darkra", license: LicenseByName("Arcane Magick 1"), ct: 23, at: 99, aoe: 30, att: 91, darkDamage: true, },
	{ name: "Darkga", license: LicenseByName("Arcane Magick 2"), ct: 23, at: 110, aoe: 30, att: 130, darkDamage: true, },
	{ name: "Ardor", license: LicenseByName("Arcane Magick 3"), ct: 23, at: 141, aoe: 19, att: 173, fireDamage: true, },
];

export default Magicks;
