import { License } from "../data/Licenses";

export type DamageFormula =
	"unarmed" | "sword" | "pole" | "mace" | "katana"
	| "hammer" | "dagger" | "gun";

export type AnimationClass = "unarmed"
	| "dagger" | "ninja" | "katana" | "sword"
	| "bigsword" | "hammer" | "pole" | "spear" | "mace"
	| "bow" | "gun" | "xbow" | "measure" | "rod" | "staff" | "handbomb";

export type Element = "fire" | "ice" | "lightning" | "water"
	| "wind" | "earth" | "dark" | "holy";

export const AllElements: Element[] = ["fire", "ice", "lightning", "water", "wind", "earth", "dark", "holy"];

export interface Environment {
	/** character index, 0-5 */
	character: number;
	/** Target physical defense */
	def: number;
	/** Target magical defense */
	mdef: number;
	/** character hp percentage, from 1 to 100 */
	percentHp: number;
	/** How much damage does the target take from the element? */
	elementReaction: { [K in Element]: 0 | 0.5 | 1 | 2 };
	/** character level, 1-99 */
	level: number;
	/** True if target resists guns and measures */
	resistGun: boolean;
	/** slowest(1) to fastest(6) */
	battleSpeed: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface Profile {
	damageType: DamageFormula;
	animationType: AnimationClass;
	/** Weapon attack value */
	attack: number;
	/** Weapon CB value */
	combo: number;
	/** Weapon CT value */
	chargeTime: number;
	/** character stat, max 99 */
	str: number;
	/** character stat, max 99 */
	mag: number;
	/** character stat, max 99 */
	vit: number;
	/** character stat, max 99 */
	spd: number;
	/** The 1st swiftness license */
	swiftness1: boolean;
	/** The 2nd swiftness license */
	swiftness2: boolean;
	/** The 3rd swiftness license */
	swiftness3: boolean;
	/** Is the brawler license available? */
	brawler: boolean;
	berserk: boolean;
	haste: boolean;
	bravery: boolean;
	/** Is the focus license available? */
	focus: boolean;
	/** Is the adrenaline license available? */
	adrenaline: boolean;
	genjiGloves: boolean;
	/** True if the weapon does damage with this element */
	elementDamgage: { [K in Element]: boolean };
	/** Is the 1.5x modfifier available? */
	elementBonus: { [K in Element]: boolean };
}

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export interface Equipment extends DeepPartial<Profile> {
	name: string;
	l?: License;
}
