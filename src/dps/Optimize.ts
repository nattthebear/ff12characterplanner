import { type Profile, type Environment, type PaperDoll, createProfile, type EquipmentPool } from "./Profile.ts";
import { calculate, type CalculateResult } from "./Calculate.ts";
import { filterEquippables, getOptimizerKeys } from "./OptimizerPrep.ts";
import Ammos from "./equip/Ammo.ts";
import type { Ability } from "./ability/Ability.ts";
import type { Equipment } from "./equip/Equipment.ts";

export interface OptimizerResult {
	ability: Ability;
	doll: PaperDoll;
	dps: CalculateResult;
}

/**
 * Given a starting profile and environment, choose the maximum dps possible.
 * If ability is 'Attack', the profile must have only one weapon in it.
 */
export function optimize(startingProfile: Profile, e: Environment, pool: EquipmentPool): OptimizerResult {
	const doll: PaperDoll = {
		weapon: pool.weapons[0],
		ammo: undefined,
		armor: undefined,
		helm: undefined,
		accessory: undefined,
	};

	const possibleKeys = getOptimizerKeys(createProfile(startingProfile, doll), e);

	const weapons = filterEquippables(pool.weapons, possibleKeys, false) as Equipment[];
	// Single-item pools are explicitly forced by the caller and must not be eliminated.
	const armors = pool.armors.length === 1 ? pool.armors : filterEquippables(pool.armors, possibleKeys, true);
	const helms = pool.helms.length === 1 ? pool.helms : filterEquippables(pool.helms, possibleKeys, true);
	const accessories = pool.accessories.length === 1 ? pool.accessories : filterEquippables(pool.accessories, possibleKeys, true);

	let topDps: CalculateResult | undefined;
	let topDoll: PaperDoll | undefined;

	for (const weapon of weapons) {
		doll.weapon = weapon;
		const forcedAmmo = pool.ammos?.length === 1 ? pool.ammos[0] : undefined;
		const ammos = pool.ammos?.length === 0
			? [undefined]
			: forcedAmmo && forcedAmmo.animationType === weapon.animationType
				? pool.ammos!
				: filterEquippables(Ammos.filter(a => a.animationType === weapon.animationType), possibleKeys, false);
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
