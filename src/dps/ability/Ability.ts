import type { License } from "../../data/Licenses.ts";
import type { Magick } from "./Magick.ts";
import type { Technick } from "./Technick.ts";

export interface AbilityBase {
	name: string;
	text: string;
	l?: License;
	alg: "attack" | "magick" | "technick";
}

interface AttackBase extends AbilityBase {
	alg: "attack";
}

export type Ability = AttackBase | Magick | Technick;

export const Attack: Ability = {
	name: "Attack",
	text: "Attack with weapon in hand.",
	alg: "attack",
};
