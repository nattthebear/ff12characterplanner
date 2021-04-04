import { Profile, Environment, PaperDoll, Equipment, createProfile, EquipmentPool } from "./Profile";
import { chooseAmmo } from "./ChooseAmmo";
import { calculate, CalculateResult } from "./Calculate";
import { filterEquippables, getOptimizerKeys } from "./OptimizerPrep";
import Ammos from "./equip/Ammo";

export interface OptimizerResult {
	doll: PaperDoll;
	dps: CalculateResult;
}

/** Given a weapon and environment, choose the maximum dps possible */
export function optimize(startingProfile: Profile, e: Environment, weapon: Equipment, pool: EquipmentPool): OptimizerResult {
	const possibleKeys = getOptimizerKeys(createProfile(startingProfile, { weapon }), e);

	// limit only to items that could potentially help the character
	const ammos = filterEquippables(Ammos.filter(a => a.type === weapon.animationType), possibleKeys);
	const armors = filterEquippables(pool.armors, possibleKeys);
	const helms = filterEquippables(pool.helms, possibleKeys);
	const accessories = filterEquippables(pool.accessories, possibleKeys);

	let topDps: CalculateResult | undefined;
	let topDoll: PaperDoll | undefined;

	for (const ammo of ammos) {
		for (const armor of armors) {
			for (const helm of helms) {
				for (const accessory of accessories) {
					const doll: PaperDoll = {
						weapon,
						ammo,
						armor,
						helm,
						accessory
					};
					const p = createProfile(startingProfile, doll);
					const dps = calculate(p, e);
					if (!topDps || dps.dps > topDps.dps) {
						topDps = dps;
						topDoll = doll;
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
