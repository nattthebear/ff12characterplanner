import { Profile, Environment, PaperDoll, Equipment, createProfile } from "../Profile";
import { chooseAmmo } from "../ChooseAmmo";
import { calculate } from "../Calculate";

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

/** The items available to a particular character to equip */
export interface EquipmentPool {
	armors: Equipment[];
	helms: Equipment[];
	accessories: Equipment[];
}

/** Given a weapon and environment, choose the maximum dps possible */
export function optimize(weapon: Equipment, e: Environment, pool: EquipmentPool): OptimizerResult {
	const initialDoll: PaperDoll = { weapon }
	const initialProfile = createProfile(initialDoll);
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
	// let topProfile = initialProfile;
	let topDoll = initialDoll;
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
				const p = createProfile(doll);
				const dps = calculate(p, e);
				if (dps > topDps) {
					topDps = dps;
					// topProfile = p;
					topDoll = doll;
				}
			}
		}
	}
	return {
		doll: topDoll,
		dps: topDps
	};
}
