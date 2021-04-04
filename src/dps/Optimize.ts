import { Profile, Environment, PaperDoll, Equipment, createProfile, EquipmentPool } from "./Profile";
import { chooseAmmo } from "./ChooseAmmo";
import { calculate, CalculateResult } from "./Calculate";
import { filterEquippables, getOptimizerKeys } from "./OptimizerPrep";

export interface OptimizerResult {
	doll: PaperDoll;
	dps: CalculateResult;
}

/** Given a weapon and environment, choose the maximum dps possible */
export function optimize(startingProfile: Profile, e: Environment, weapon: Equipment, pool: EquipmentPool): OptimizerResult {
	const ammo = chooseAmmo(createProfile(startingProfile, { weapon }), e);
	const possibleKeys = getOptimizerKeys(createProfile(startingProfile, { weapon, ammo }), e);

	// limit only to items that could potentially help the character
	const armors = filterEquippables(pool.armors, possibleKeys);
	const helms = filterEquippables(pool.helms, possibleKeys);
	const accessories = filterEquippables(pool.accessories, possibleKeys);

	let topDps: CalculateResult | undefined;
	let topDoll: PaperDoll | undefined;
	{
		let armor: Equipment | undefined = undefined;
		let helm: Equipment | undefined = undefined;
		let accessory: Equipment | undefined = undefined;
		let iter = 0;
		for (; iter < 10; iter++) {
			let changed = false;
			for (const nextArmor of armors) {
				const doll: PaperDoll = {
					weapon,
					ammo,
					armor: nextArmor,
					helm,
					accessory
				};
				const p = createProfile(startingProfile, doll);
				const dps = calculate(p, e);
				if (!topDps || dps.dps > topDps.dps) {
					// console.log(`${armor && armor.name} => ${nextArmor && nextArmor.name}`);
					armor = nextArmor;
					topDps = dps;
					topDoll = doll;
					changed = true;
				}
			}
			for (const nextHelm of helms) {
				const doll: PaperDoll = {
					weapon,
					ammo,
					armor,
					helm: nextHelm,
					accessory
				};
				const p = createProfile(startingProfile, doll);
				const dps = calculate(p, e);
				if (!topDps || dps.dps > topDps.dps) {
					// console.log(`${helm && helm.name} => ${nextHelm && nextHelm.name}`);
					helm = nextHelm;
					topDps = dps;
					topDoll = doll;
					changed = true;
				}
			}
			for (const nextAccessory of accessories) {
				const doll: PaperDoll = {
					weapon,
					ammo,
					armor,
					helm,
					accessory: nextAccessory
				};
				const p = createProfile(startingProfile, doll);
				const dps = calculate(p, e);
				if (!topDps || dps.dps > topDps.dps) {
					// console.log(`${accessory && accessory.name} => ${nextAccessory && nextAccessory.name}`);
					accessory = nextAccessory;
					topDps = dps;
					topDoll = doll;
					changed = true;
				}
			}
			if (!changed) {
				break;
			}
		}
		if (iter > 2) {
			// weapons that do no damage under any cirumstances (att * 1.125 < def) take 1 iteration;
			// because everything does 0 damage, the optimizer can't observe any changes and just gives up and goes naked

			// most normal circumstances take 2 iterations, as each choice is stable against the other choices,
			// so the second iteration is only needed to confirm everything

			// some unusal circumstances take 3 iterations.  for instance, unarmed with target def >= ~15 and no brawler
			// takes an entire iteration to find the jade collar, and then another iteration to choose other pieces

			// anything more than 3 is unusual and likely indicates some sort of fubar bug
			console.warn(`${iter + 1} iterations to optimize ${weapon.name}, maybe wrong?`);
		}
	}
	return {
		doll: topDoll!,
		dps: topDps!
	};
}
