import { Profile, Environment, PaperDoll, Equipment, createProfile, EquipmentPool } from "./Profile";
import { calculate, CalculateResult } from "./Calculate";
import { filterEquippables, getOptimizerKeys } from "./OptimizerPrep";
import Ammos from "./equip/Ammo";
import { Ability, Attack } from "./ability/Ability";
import Weapon from "./equip/Weapon";

export interface OptimizerResult {
	ability: Ability;
	doll: PaperDoll;
	dps: CalculateResult;
}

const Unarmed = Weapon.find(w => w.name === "Unarmed")!;

// TODO: Unify these functions better

/** Given a magick spell and environment, choose the maximum dps possible. */
export function optimizeMagick(startingProfile: Profile, e: Environment, pool: EquipmentPool): OptimizerResult {
	const doll: PaperDoll = {
		weapon: Unarmed,
		ammo: undefined,
		armor: undefined,
		helm: undefined,
		accessory: undefined,
	};

	const possibleKeys = getOptimizerKeys(createProfile(startingProfile, doll), e);

	const weapons = filterEquippables(pool.weapons, possibleKeys, false) as Equipment[];
	const armors = filterEquippables(pool.armors, possibleKeys, true);
	const helms = filterEquippables(pool.helms, possibleKeys, true);
	const accessories = filterEquippables(pool.accessories, possibleKeys, true);

	let topDps: CalculateResult | undefined;
	let topDoll: PaperDoll | undefined;

	for (const weapon of weapons) {
		doll.weapon = weapon;
		const ammos = filterEquippables(Ammos.filter(a => a.type === weapon.animationType), possibleKeys, false);
		for (const ammo of ammos) {
			doll.ammo = ammo;
			for (const armor of armors) {
				doll.armor = armor;
				for (const helm of helms) {
					doll.helm = helm;
					for (const accessory of accessories) {
						doll.accessory = accessory;
						const p = createProfile(startingProfile, doll);
						const dps = calculate(p, e);
						if (!topDps || dps.dps > topDps.dps) {
							topDps = dps;
							topDoll = { ...doll };
						}
					}
				}
			}
		}
	}
	return {
		ability: startingProfile.ability,
		doll: topDoll!,
		dps: topDps!,
	};
}

/** Given a weapon and environment, choose the maximum dps possible with attack. */
export function optimizeAttack(startingProfile: Profile, e: Environment, weapon: Equipment, pool: EquipmentPool): OptimizerResult {
	const doll: PaperDoll = {
		weapon,
		ammo: undefined,
		armor: undefined,
		helm: undefined,
		accessory: undefined,
	};

	const possibleKeys = getOptimizerKeys(createProfile(startingProfile, doll), e);

	// limit only to items that could potentially help the character
	const ammos = filterEquippables(Ammos.filter(a => a.type === weapon.animationType), possibleKeys, false);
	const armors = filterEquippables(pool.armors, possibleKeys, true);
	const helms = filterEquippables(pool.helms, possibleKeys, true);
	const accessories = filterEquippables(pool.accessories, possibleKeys, true);

	let topDps: CalculateResult | undefined;
	let topDoll: PaperDoll | undefined;

	for (const ammo of ammos) {
		doll.ammo = ammo;
		for (const armor of armors) {
			doll.armor = armor;
			for (const helm of helms) {
				doll.helm = helm;
				for (const accessory of accessories) {
					doll.accessory = accessory;
					const p = createProfile(startingProfile, doll);
					const dps = calculate(p, e);
					if (!topDps || dps.dps > topDps.dps) {
						topDps = dps;
						topDoll = { ...doll };
					}
				}
			}
		}
	}
	return {
		ability: Attack,
		doll: topDoll!,
		dps: topDps!,
	};
}
