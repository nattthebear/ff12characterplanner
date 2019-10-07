import { Profile, Environment, PaperDoll, Equipment, createProfile, EquipmentPool } from "./Profile";
import { chooseAmmo } from "./ChooseAmmo";
import { calculate } from "./Calculate";

/** Given a profile where the weapon has already been chosen, and an environment, determine what stats could be beneficial */
function getOptimizerKeys(p: Profile, e: Environment) {
	// can leave out any key that's only found on weapons, or is not relevant to this weapon
	const ret: (keyof Profile)[] = [
		"attack",
		"spd", // always needed for csmod
	];

	if (p.holyDamage) {
		ret.push("holyBonus");
	}
	if (p.darkDamage) {
		ret.push("darkBonus");
	}

	// if we already have these licenses, then the accessories with them won't be relevant
	for (const k of ["berserk", "haste", "bravery", "focus", "adrenaline", "genjiGloves"] as const) {
		if (!p[k]) {
			ret.push(k);
		}
	}

	switch (p.damageType) {
		case "unarmed":
			ret.push("str");
			if (!p.brawler) {
				ret.push("brawler");
			}
			break;
		case "sword":
		case "pole":
		case "hammer":
		case "dagger":
			ret.push("str");
			break;
		case "mace":
			ret.push("mag");
			break;
		case "katana":
			ret.push("str", "mag");
			break;
		default:
			break;
	}

	return ret;
}

function filterEquippable(eq: Equipment, keys: (keyof Profile)[]) {
	for (const k in eq) {
		if (keys.includes(k as keyof Profile)) {
			return true;
		}
	}
	return false;
}

export interface OptimizerResult {
	doll: PaperDoll;
	dps: number;
}

/** Given a weapon and environment, choose the maximum dps possible */
export function optimize(startingProfile: Profile, e: Environment, weapon: Equipment, pool: EquipmentPool): OptimizerResult {
	const initialDoll: PaperDoll = { weapon }
	const initialProfile = createProfile(startingProfile, initialDoll);
	const possibleKeys = getOptimizerKeys(initialProfile, e);

	const ammo = chooseAmmo(initialProfile, e);

	// limit only to items that could potentially help the character
	const armors: (Equipment | undefined)[] = pool.armors.filter(eq => filterEquippable(eq, possibleKeys));
	if (!armors.length) {
		armors.push(undefined);
	}
	const helms: (Equipment | undefined)[] = pool.helms.filter(eq => filterEquippable(eq, possibleKeys));
	if (!helms.length) {
		helms.push(undefined);
	}
	const accessories: (Equipment | undefined)[] = pool.accessories.filter(eq => filterEquippable(eq, possibleKeys));
	if (!accessories.length) {
		accessories.push(undefined);
	}

	let topDps = 0;
	let topDoll = initialDoll;
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
				if (dps > topDps) {
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
				if (dps > topDps) {
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
				if (dps > topDps) {
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
		doll: topDoll,
		dps: topDps
	};
}
