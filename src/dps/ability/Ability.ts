import { License } from "../../data/Licenses";
import { Magick } from "./Magick";

export interface AbilityBase {
	name: string;
	text: string;
	l?: License;
	alg: "attack" | "magick";
}

interface AttackBase extends AbilityBase {
	alg: "attack";
}

export type Ability = AttackBase | Magick;

export const Attack: Ability = {
	name: "Attack",
	text: "Attack with equipped weapon",
	alg: "attack",
};
