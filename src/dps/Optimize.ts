import { Profile, Environment, PaperDoll, Equipment, createProfile, EquipmentPool } from "./Profile";
import { chooseAmmo } from "./ChooseAmmo";
import { calculate, CalculateResult } from "./Calculate";

/** Given a profile where the weapon has already been chosen, and an environment, determine what stats could be beneficial */
function getOptimizerKeys(p: Profile, e: Environment) {
	// can leave out any key that's only found on weapons, or is not relevant to this weapon
	const ret = new Set<keyof Profile>([
		"attack",
		"spd", // always needed for csmod
	]);

	if (p.holyDamage) {
		ret.add("holyBonus");
	}
	if (p.darkDamage) {
		ret.add("darkBonus");
	}

	ret.add("focus");
	ret.add("adrenaline");
	if (p.combo > 0) {
		ret.add("genjiGloves");
	}

	// if we already have these licenses, then the accessories with them won't be relevant
	for (const k of ["berserk", "haste", "bravery"] as const) {
		if (!e[k]) {
			ret.add(k);
		}
	}

	switch (p.damageType) {
		case "unarmed":
			ret.add("str");
			if (!p.brawler) {
				ret.add("brawler");
			}
			break;
		case "sword":
		case "pole":
		case "hammer":
		case "dagger":
			ret.add("str");
			break;
		case "mace":
			ret.add("mag");
			break;
		case "katana":
			ret.add("str");
			ret.add("mag");
			break;
		default:
			break;
	}

	return ret;
}

function filterEquippables(eqs: Equipment[], keys: Set<keyof Profile>) {
	// Eliminate any item that has no possible value, and then any item that is pareto infero to another.

	// Every attribute possible here has a boolean or number value and a nonnegative return.
	// In the future (improved ammo selection, weather effects), this might not be true.

	const ret = eqs.filter(eq => {
		for (const k in eq) {
			if (keys.has(k as keyof Profile)) {
				return true;
			}
		}
		return false;
	});

	for (let i = 0; i < ret.length; i++) {
		next_eq:
		for (let j = 0; j < ret.length; j++) {
			if (i === j) {
				continue;
			}
			const x = ret[i];
			const y = ret[j];

			for (const k in x) {
				if (!keys.has(k as keyof Profile)) {
					continue;
				}
				if (!(k in y)) {
					continue next_eq;
				}
				const vx = +(x as any)[k];
				const vy = +(y as any)[k];
				if (vx > vy) {
					continue next_eq;
				}
			}
			// x is pareto inferior to y
			ret.splice(i--, 1);
			break;
		}
	}
	const realRet = ret as (Equipment | undefined)[];
	if (!realRet.length) {
		realRet.push(undefined);
	}
	return realRet;
}

export interface OptimizerResult {
	doll: PaperDoll;
	dps: CalculateResult;
}

/** Given a weapon and environment, choose the maximum dps possible */
export function optimize(startingProfile: Profile, e: Environment, weapon: Equipment, pool: EquipmentPool): OptimizerResult {
	const ammo = chooseAmmo(createProfile(startingProfile, { weapon }), e);
	const possibleKeys = getOptimizerKeys(createProfile(startingProfile, { weapon, ammo }), e);

	// limit only to items that could potentially help the character
	const armors: (Equipment | undefined)[] = filterEquippables(pool.armors, possibleKeys);
	if (!armors.length) {
		armors.push(undefined);
	}
	const helms: (Equipment | undefined)[] = filterEquippables(pool.helms, possibleKeys);
	if (!helms.length) {
		helms.push(undefined);
	}
	const accessories: (Equipment | undefined)[] = filterEquippables(pool.accessories, possibleKeys);
	if (!accessories.length) {
		accessories.push(undefined);
	}

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
