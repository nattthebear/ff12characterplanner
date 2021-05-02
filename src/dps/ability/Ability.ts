import { License } from "../../data/Licenses";
import { Magick } from "./Magick";
import { Technick } from "./Technick";

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
