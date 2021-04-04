import { Profile, Environment, PaperDoll, Equipment, createProfile, EquipmentPool } from "./Profile";
import { calculate, CalculateResult } from "./Calculate";
import { filterEquippables, getOptimizerKeys } from "./OptimizerPrep";
import Ammos from "./equip/Ammo";

export interface OptimizerResult {
	doll: PaperDoll;
	dps: CalculateResult;
}

/** Given a weapon and environment, choose the maximum dps possible */
export function optimize(startingProfile: Profile, e: Environment, weapon: Equipment, pool: EquipmentPool): OptimizerResult {
	const doll: PaperDoll = {
		weapon,
		ammo: undefined,
		armor: undefined,
		helm: undefined,
		accessory: undefined,
	};

	const possibleKeys = getOptimizerKeys(createProfile(startingProfile, doll), e);

	// limit only to items that could potentially help the character
	const ammos = filterEquippables(Ammos.filter(a => a.type === weapon.animationType), possibleKeys);
	const armors = filterEquippables(pool.armors, possibleKeys);
	const helms = filterEquippables(pool.helms, possibleKeys);
	const accessories = filterEquippables(pool.accessories, possibleKeys);

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
		doll: topDoll!,
		dps: topDps!
	};
}
