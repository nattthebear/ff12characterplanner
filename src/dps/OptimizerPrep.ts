import { Magick } from "./ability/Magick";
import { Technick } from "./ability/Technick";
import { AllElements, Equipment, OptimizerKey } from "./equip/Equipment";
import { Environment, Profile } from "./Profile";

/** Given a profile and an environment, determine what stats could be beneficial */
export function getOptimizerKeys(p: Profile, e: Environment) {
	const { ability } = p;
	if (ability.alg === "attack") {
		// Assumes a single weapon has been chosen already!
		return getOptimizerKeysForAttack(p, e);
	} else if (ability.alg === "magick") {
		return getOptimizerKeysForMagick(ability, p, e);
	} else {
		return getOptimizerKeysForTechnick(ability, e);
	}
}

function getOptimizerKeysForTechnick(t: Technick, e: Environment) {
	const ret = new Set<OptimizerKey>([
		"spd", // always needed for csmod
	]);

	if (t.name === "Telekinesis") {
		ret.add("attack");
		ret.add("animationType");
	} else if (t.name === "Souleater") {
		ret.add("attack");
		ret.add("str");
	}

	// if we already have these buffs, then the accessories with them won't be relevant
	if (!e.haste) {
		ret.add("haste");
	}
	return ret;
}

function getOptimizerKeysForMagick(m: Magick, p: Profile, e: Environment) {
	const ret = new Set<OptimizerKey>([
		"mag",
		"spd", // always needed for csmod
	]);

	for (const element of AllElements) {
		if (m[`${element}Damage` as const]) {
			ret.add(`${element}Bonus` as const);
			break;
		}
	}

	if (e.weather !== "other" || e.terrain !== "other") {
		ret.add("agateRing");
	}

	// if we already have these buffs, then the accessories with them won't be relevant
	for (const k of ["haste", "faith"] as const) {
		if (!e[k]) {
			ret.add(k);
		}
	}
	// if we already have these licenses, then the accessories with them won't be relevant
	for (const k of ["serenity", "spellbreaker"] as const) {
		if (!p[k]) {
			ret.add(k);
		}
	}

	return ret;
}

function getOptimizerKeysForAttack(p: Profile, e: Environment) {
	// can leave out any key that's only found on weapons, or is not relevant to this weapon
	const ret = new Set<OptimizerKey>([
		"attack",
		"spd", // always needed for csmod

		// Depending on what other things are potentially available and the environment, some elemental
		// possibilities can be eliminated sometimes.  Let's not worry about that right now?
		"fireDamage",
		"iceDamage",
		"lightningDamage",
		"waterDamage",
		"windDamage",
		"earthDamage",
		"darkDamage",
		"holyDamage",

		// Only bonuses found off of weapons
		"holyBonus",
		"darkBonus",

		"focus",
		"adrenaline",
	]);

	if (p.combo > 0) {
		ret.add("genjiGloves");
	}
	if (e.parry 
		|| e.block > 0
		|| (e.weather === "windy" || e.weather === "windy and rainy") && (p.animationType === "bow" || p.animationType === "xbow")
	) {
		ret.add("cameoBelt");
	}
	if (e.weather !== "other" || e.terrain !== "other") {
		ret.add("agateRing");
	}

	// if we already have these buffs, then the accessories with them won't be relevant
	for (const k of ["berserk", "haste", "bravery"] as const) {
		if (!e[k]) {
			ret.add(k);
		}
	}
	// if we already have these licenses, then the accessories with them won't be relevant
	for (const k of ["focus", "adrenaline"] as const) {
		if (!p[k]) {
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
		case "dagger":
			ret.add("str");
			break;
		case "hammer":
			ret.add("str");
			ret.add("vit");
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

/** Given a set of potential optimizerKeys, eliminate equipment that has no relevantkeys or is always worse than other equipment. */
export function filterEquippables(eqs: Equipment[], oKeys: Set<OptimizerKey>, allowEmpty: boolean) {
	// Eliminate any item that has no possible value, and then any item that is pareto inferor to another.
	const items: Equipment[] = [];
	/** hazardKeys make an item uncomparable */
	const hazardItems: Equipment[] = [];

	let i = 0; // starting point for items to remove

	next_eq:
	for (const eq of eqs) {
		for (const key of eq.hazardKeys) {
			if (oKeys.has(key)) {
				hazardItems.push(eq);
				continue next_eq;
			}
		}
		for (const key of eq.uniqueBenefitKeys) {
			if (oKeys.has(key)) {
				items.unshift(eq);
				i++;
				continue next_eq;
			}
		}
		for (const key of eq.sharedBenefitMap.keys()) {
			if (oKeys.has(key)) {
				items.push(eq);
				continue next_eq;
			}
		}
	}

	for (; i < items.length; i++) {
		inner_eq:
		for (let j = 0; j < items.length; j++) {
			if (i === j) {
				continue;
			}
			const x = items[i];
			const y = items[j];

			for (const k of x.sharedBenefitMap.keys()) {
				if (!oKeys.has(k)) {
					continue;
				}
				if (!y.sharedBenefitMap.has(k)) {
					continue inner_eq;
				}
				const vx = x.sharedBenefitMap.get(k)!;
				const vy = y.sharedBenefitMap.get(k)!;
				if (vx > vy) {
					continue inner_eq;
				}
			}
			// x is pareto inferior to y
			items.splice(i--, 1);
			break;
		}
	}
	items.push(...hazardItems);
	const realRet = items as (Equipment | undefined)[];
	if (!realRet.length) {
		realRet.push(allowEmpty ? undefined : eqs[0]);
	}
	return realRet;
}
