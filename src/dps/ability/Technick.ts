import { LicenseByName } from "../../data/Licenses";
import { AbilityBase } from "./Ability";


const l = LicenseByName;

export interface Technick extends AbilityBase {
	alg: "technick";

	/** Charge Time constant */
	ct: number;
	/** Base hit % */
	chn: number;
	/** Animation time in 1/30s */
	at: number;
	/** Extra hit time in 1/30s */
	aoe?: number;
}
const Technicks: Technick[] = [
	{ name: "1000 Needles", text: "Deal 1,000 damage to one foe.", l: l("1000 Needles"), alg: "technick", ct: 25, chn: 100, at: 114, },
	{ name: "Souleater", text: "Consume HP to deal damage to one foe.", l: l("Souleater"), alg: "technick", ct: 30, chn: 200, at: 126, },
	{ name: "Gil Toss", text: "Throw gil, damaging all foes in range.", l: l("Gil Toss"), alg: "technick", ct: 30, chn: 200, at: 75, aoe: 20, },
	{ name: "Horology", text: "Deal damage based on a factor of time to all foes in range.", l: l("Horology"), alg: "technick", ct: 30, chn: 90, at: 105, aoe: 30, },
	{ name: "Telekinesis", text: "Deal ranged damage with melee weapons.", l: l("Telekinesis"), alg: "technick", ct: 30, chn: 80, at: 36, },
];

export default Technicks;
