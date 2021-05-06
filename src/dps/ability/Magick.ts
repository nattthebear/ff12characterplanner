import { LicenseByName } from "../../data/Licenses";
import { AbilityBase } from "./Ability";

const l = LicenseByName;

export interface Magick extends AbilityBase {
	alg: "magick";

	/** Charge Time constant */
	ct: number;
	/** Animation time in 1/30s */
	at: number;
	/** Extra hit time in 1/30s */
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
	{ name: "Cure", text: "Restore a small amount of HP to one ally.", l: l("White Magick 1"), alg: "magick", ct: 23, at: 111, att: 20, special: "heal", },
	{ name: "Cura", text: "Restore HP to all allies in range.", l: l("White Magick 4"), alg: "magick", ct: 23, at: 117, aoe: 30, att: 46, special: "heal", },
	{ name: "Curaga", text: "Restore a large amount of HP to one ally.", l: l("White Magick 6"), alg: "magick", ct: 23, at: 144, att: 86, special: "heal", },
	{ name: "Curaja", text: "Restore a large amount of HP to all allies in range.", l: l("White Magick 9"), alg: "magick", ct: 23, at: 114, aoe: 30, att: 120, special: "heal", },
	{ name: "Holy", text: "Deal heavy holy damage to one target.", l: l("White Magick 11"), alg: "magick", ct: 23, at: 227, att: 157, holyDamage: true, },

	{ name: "Fire", text: "Deal fire damage to one foe.", l: l("Black Magick 1"), alg: "magick", ct: 23, at: 75, att: 22, fireDamage: true, },
	{ name: "Fira", text: "Deal fire damage to all foes in range.", l: l("Black Magick 5"), alg: "magick", ct: 23, at: 75, aoe: 30, att: 67, fireDamage: true, },
	{ name: "Firaga", text: "Deal heavy fire damage to all foes in range.", l: l("Black Magick 9"), alg: "magick", ct: 23, at: 75, aoe: 30, att: 120, fireDamage: true, },
	{ name: "Thunder", text: "Deal lightning damage to one foe.", l: l("Black Magick 1"), alg: "magick", ct: 23, at: 75, att: 23, lightningDamage: true, },
	{ name: "Thundara", text: "Deal lightning damage to all foes in range.", l: l("Black Magick 6"), alg: "magick", ct: 23, at: 84, aoe: 114, att: 68, lightningDamage: true, },
	{ name: "Thundaga", text: "Deal heavy lightning damage to all foes in range.", l: l("Black Magick 9"), alg: "magick", ct: 23, at: 96, aoe: 48, att: 122, lightningDamage: true, },
	{ name: "Blizzard", text: "Deal ice damage to one foe.", l: l("Black Magick 2"), alg: "magick", ct: 23, at: 102, att: 25, iceDamage: true, },
	{ name: "Blizzara", text: "Deal ice damage to all foes in range.", l: l("Black Magick 6"), alg: "magick", ct: 23, at: 102, aoe: 30, att: 70, iceDamage: true, },
	{ name: "Blizzaga", text: "Deal heavy ice damage to all foes in range.", l: l("Black Magick 10"), alg: "magick", ct: 23, at: 105, aoe: 75, att: 125, iceDamage: true, },
	{ name: "Aero", text: "Deal wind damage to all foes in range.", l: l("Black Magick 4"), alg: "magick", ct: 23, at: 90, aoe: 24, att: 51, windDamage: true, },
	{ name: "Aeroga", text: "Deal heavy wind damage to all foes in range.", l: l("Black Magick 8"), alg: "magick", ct: 23, at: 108, aoe: 36, att: 103, windDamage: true, },

	{ name: "Aqua", text: "Deal water damage to one foe.", l: l("Black Magick 3"), alg: "magick", ct: 23, at: 153, att: 37, waterDamage: true, },
	{ name: "Bio", text: "Inflict Sap and deal damage to all foes in range.", l: l("Black Magick 7"), alg: "magick", ct: 23, at: 106, aoe: 30, att: 67, },
	{ name: "Shock", text: "Deal heavy damage to one foe.", l: l("Black Magick 11"), alg: "magick", ct: 23, at: 123, att: 133, },
	{ name: "Scourge", text: "Inflict Sap and deal heavy damage to all foes in range.", l: l("Black Magick 12"), alg: "magick", ct: 23, at: 117, aoe: 45, att: 142, },
	{ name: "Flare", text: "Deal massive damage to one foe.", l: l("Black Magick 12"), alg: "magick", ct: 23, at: 305, att: 163, },
	{ name: "Scathe", text: "Deal massive damage to all foes in range.", l: l("Black Magick 13"), alg: "magick", ct: 23, at: 218, aoe: 0, att: 190, },

	/* TODO
	{ name: "Balance", text: "Deal damage equal to difference between caster's current and max HP to all foes in range.", l: l("Time Magick 3"), alg: "magick", ct: 23, at: 0, aoe: 0, att: 0, },
	{ name: "Gravity", text: "Reduce HP of all foes in range by 1/4 of targets' max HP.", l: l("Time Magick 4"), alg: "magick", ct: 23, at: 0, aoe: 0, att: 0, },
	{ name: "Graviga", text: "Reduces HP of all foes in range by 1/2 of targets' max HP.", l: l("Time Magick 10"), alg: "magick", ct: 23, at: 0, aoe: 0, att: 0, },
	*/

	{ name: "Drain", text: "Transfer HP from one foe to the caster.", l: l("Green Magick 2"), alg: "magick", ct: 23, at: 129, att: 62, special: "drain", },

	{ name: "Dark", text: "Deal moderate dark damage to all foes in range.", l: l("Arcane Magick 1"), alg: "magick", ct: 23, at: 96, aoe: 30, att: 46, darkDamage: true, },
	{ name: "Darkra", text: "Deal dark damage to all foes in range.", l: l("Arcane Magick 1"), alg: "magick", ct: 23, at: 99, aoe: 30, att: 91, darkDamage: true, },
	{ name: "Darkga", text: "Deal heavy dark damage to all foes in range.", l: l("Arcane Magick 2"), alg: "magick", ct: 23, at: 110, aoe: 30, att: 130, darkDamage: true, },
	{ name: "Ardor", text: "Deal massive fire damage to all foes in range.", l: l("Arcane Magick 3"), alg: "magick", ct: 23, at: 141, aoe: 19, att: 173, fireDamage: true, },
];

export default Magicks;
