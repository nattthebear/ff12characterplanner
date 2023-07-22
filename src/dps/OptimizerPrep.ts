import { Magick } from "./ability/Magick";
import { Technick } from "./ability/Technick";
import { AllElements, Equipment, KEY_adrenaline, KEY_agateRing, KEY_animationType, KEY_berserk, KEY_bravery, KEY_brawler, KEY_cameoBelt, KEY_darkDamage, KEY_earthDamage, KEY_faith, KEY_fireDamage, KEY_focus, KEY_genjiGloves, KEY_haste, KEY_holyDamage, KEY_iceDamage, KEY_lightningDamage, KEY_serenity, KEY_spellbreaker, KEY_waterDamage, KEY_windDamage, LENGTH_Shared, MASK_Hazard, MASK_Shared, MASK_Unique, SKEY_attack, SKEY_darkBonus, SKEY_earthBonus, SKEY_fireBonus, SKEY_holyBonus, SKEY_iceBonus, SKEY_lightningBonus, SKEY_mag, SKEY_spd, SKEY_str, SKEY_vit, SKEY_waterBonus, SKEY_windBonus } from "./equip/Equipment";
import { Environment, Profile } from "./Profile";

interface OptimizerKeys {
	hazardUniqueMask: number;
	sharedMask: number;
}

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

function getOptimizerKeysForTechnick(t: Technick, e: Environment): OptimizerKeys {
	let hazardUniqueMask = 0;
	let sharedMask = SKEY_spd; // always needed for csmod

	if (t.name === "Telekinesis") {
		sharedMask |= SKEY_attack;
		hazardUniqueMask |= KEY_animationType;
	} else if (t.name === "Souleater") {
		sharedMask |= SKEY_attack;
		sharedMask |= SKEY_str;
	}

	// if we already have these buffs, then the accessories with them won't be relevant
	if (!e.haste) {
		hazardUniqueMask |= KEY_haste;
	}

	return {
		hazardUniqueMask,
		sharedMask,
	};
}

function getOptimizerKeysForMagick(m: Magick, p: Profile, e: Environment): OptimizerKeys {
	let hazardUniqueMask = 0;
	let sharedMask = SKEY_mag | SKEY_spd; // spd always needed for csmod

	if (m.fireDamage) {
		sharedMask |= SKEY_fireBonus;
	}
	if (m.iceDamage) {
		sharedMask |= SKEY_iceBonus;
	}
	if (m.lightningDamage) {
		sharedMask |= SKEY_lightningBonus;
	}
	if (m.waterDamage) {
		sharedMask |= SKEY_waterBonus;
	}
	if (m.windDamage) {
		sharedMask |= SKEY_windBonus;
	}
	if (m.earthDamage) {
		sharedMask |= SKEY_earthBonus;
	}
	if (m.darkDamage) {
		sharedMask |= SKEY_darkBonus;
	}
	if (m.holyDamage) {
		sharedMask |= SKEY_holyBonus;
	}

	if (e.weather !== "other" || e.terrain !== "other") {
		hazardUniqueMask |= KEY_agateRing;
	}

	// if we already have these buffs, then the accessories with them won't be relevant
	if (!e.haste) {
		hazardUniqueMask |= KEY_haste;
	}
	if (!e.faith) {
		hazardUniqueMask |= KEY_faith;
	}

	// if we already have these licenses, then the accessories with them won't be relevant
	if (!p.serenity) {
		hazardUniqueMask |= KEY_serenity;
	}
	if (!p.spellbreaker) {
		hazardUniqueMask |= KEY_spellbreaker;
	}

	return {
		hazardUniqueMask,
		sharedMask,
	};
}

function getOptimizerKeysForAttack(p: Profile, e: Environment): OptimizerKeys {
	// can leave out any key that's only found on weapons, or is not relevant to this weapon

	let hazardUniqueMask =
		// Depending on what other things are potentially available and the environment, some elemental
		// possibilities can be eliminated sometimes.  Let's not worry about that right now?
		KEY_fireDamage
		| KEY_iceDamage
		| KEY_lightningDamage
		| KEY_waterDamage
		| KEY_windDamage
		| KEY_earthDamage
		| KEY_darkDamage
		| KEY_holyDamage
		| KEY_focus // TODO: ARE THESE TWO AN OLD BUG?
		| KEY_adrenaline;
	let sharedMask =
		SKEY_attack
		| SKEY_spd // always needed for csmod
		// Only bonuses found off of weapons
		| SKEY_holyBonus
		| SKEY_darkBonus;

	if (p.combo > 0) {
		hazardUniqueMask |= KEY_genjiGloves;
	}
	if (e.parry 
		|| e.block > 0
		|| (e.weather === "windy" || e.weather === "windy and rainy") && (p.animationType === "bow" || p.animationType === "xbow")
	) {
		hazardUniqueMask |= KEY_cameoBelt;
	}
	if (e.weather !== "other" || e.terrain !== "other") {
		hazardUniqueMask |= KEY_agateRing;
	}

	// if we already have these buffs, then the accessories with them won't be relevant
	if (!e.berserk) {
		hazardUniqueMask |= KEY_berserk;
	}
	if (!e.haste) {
		hazardUniqueMask |= KEY_haste;
	}
	if (!e.bravery) {
		hazardUniqueMask |= KEY_bravery;
	}

	// if we already have these licenses, then the accessories with them won't be relevant
	if (!p.focus) {
		hazardUniqueMask |= KEY_focus;
	}
	if (!p.adrenaline) {
		hazardUniqueMask |= KEY_adrenaline;
	}

	switch (p.damageType) {
		case "unarmed":
			sharedMask |= SKEY_str;
			if (!p.brawler) {
				hazardUniqueMask |= KEY_brawler;
			}
			break;
		case "sword":
		case "pole":
		case "dagger":
			sharedMask |= SKEY_str;
			break;
		case "hammer":
			sharedMask |= SKEY_str;
			sharedMask |= SKEY_vit;
			break;
		case "mace":
			sharedMask |= SKEY_mag;
			break;
		case "katana":
			sharedMask |= SKEY_str;
			sharedMask |= SKEY_mag;
			break;
		default:
			break;
	}

	return {
		hazardUniqueMask,
		sharedMask,
	};
}

/** Given a set of potential optimizerKeys, eliminate equipment that has no relevantkeys or is always worse than other equipment. */
export function filterEquippables(eqs: Equipment[], { hazardUniqueMask, sharedMask }: OptimizerKeys, allowEmpty: boolean) {
	// Eliminate any item that has no possible value, and then any item that is pareto inferor to another.
	const items: Equipment[] = [];
	/** hazardKeys make an item uncomparable */
	const hazardItems: Equipment[] = [];

	let i = 0; // starting point for items to remove

	const okeyHazardMask = hazardUniqueMask & MASK_Hazard;
	const okeyUniqueMask = hazardUniqueMask & MASK_Unique;
	const okeySharedMask = sharedMask & MASK_Shared;

	for (const eq of eqs) {
		if (eq.hazardUniqueMask & okeyHazardMask) {
			hazardItems.push(eq);
		} else if (eq.hazardUniqueMask & okeyUniqueMask) {
			items.unshift(eq);
			i++;
		} else if (eq.sharedMask & okeySharedMask) {
			items.push(eq);	
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

			const xs = x.sharedValues;
			const ys = y.sharedValues;

			for (let sharedIndex = 0; sharedIndex < LENGTH_Shared; sharedIndex++) {
				if (!(okeySharedMask & 1 << sharedIndex)) {
					continue;
				}
				const xv = xs[sharedIndex];
				const yv = ys[sharedIndex];
				if (xv > yv) {
					continue inner_eq;
				}
			}

			// for (const k of x.sharedBenefitMap.keys()) {
			// 	if (!oKeys.has(k)) {
			// 		continue;
			// 	}
			// 	if (!y.sharedBenefitMap.has(k)) {
			// 		continue inner_eq;
			// 	}
			// 	const vx = x.sharedBenefitMap.get(k)!;
			// 	const vy = y.sharedBenefitMap.get(k)!;
			// 	if (vx > vy) {
			// 		continue inner_eq;
			// 	}
			// }
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
