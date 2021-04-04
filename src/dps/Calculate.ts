import { AnimationTimings } from "./AnimationTiming";
import { Profile, Environment, AllElements } from "./Profile";

/** model attack damage against armor */
function admg(att: number, lowMul: number, highMul: number, def: number) {
	const lo = att * lowMul;
	const hi = att * highMul;
	if (lo >= def) {
		return (lo + hi) / 2 - def;
	} else if (hi <= def) {
		return 0;
	} else {
		// whenever some attacks do 0 damage, you need to more precisely calculate things
		// simply doing (att * (lowMul + highMul) / 2 - def) will model things incorrectly,
		// because the attacks at the low end don't do negative damage

		/** chance for an attack to deal 0 damage */
		const pZero = (def - lo) / (hi - lo);

		/** The rest (1 - pZero), of the time, attacks will be evenly distributed from def to hi */
		return (1 - pZero) * (hi - def) / 2;
	}
}

function computeCsmod(spd: number) {
	// My only source of data is a second hand description of a small poorly labeled graph in Ultimania
	// It provided some approximate values for "CT x CSMOD", with the assumption that CT = 35
	// I ran those through a regression and got this.
	// The formula doesn't look entirely unmotivated, but it's kind of a shot in the dark

	const a = 1.022342422396204;
	const b = 5.268190606448866;
	const csmod = 1 / (spd * a + b) + 0.1;
	return csmod;
}

function calcChargeTime(p: Profile, e: Environment) {
	const ct = p.chargeTime;
	const csmod = computeCsmod(p.spd);

	const ran = 0.25;
	let lmod = 1;
	if (p.swiftness1) {
		lmod -= 0.12;
	}
	if (p.swiftness2) {
		lmod -= 0.12;
	}
	if (p.swiftness3) {
		lmod -= 0.12;
	}
	const bmod = 1 / (0.8 + e.battleSpeed / 5);
	let stmod = 1;
	if (p.berserk) {
		stmod /= 2;
	}
	if (p.haste) {
		stmod /= 1.5;
	}
	return (ct * csmod + ran) * lmod * bmod * stmod;
}

export interface CalculateResult {
	/** The final overall dps */
	dps: number;
	/** Damage done by the weapon */
	baseDmg: number;
	/** Damage including multipliers like bravery, berserk, etc */
	modifiedDamage: number;
	/** Damage done per action including the possibility of crits or combos */
	comboDamage: number;
	/** Charge time per action */
	chargeTime: number;
	/** Animation time per action including the possibility of combos */
	animationTime: number;
}

/** Calculates the final average DPS value for this situation */
export function calculate(p: Profile, e: Environment): CalculateResult {
	let baseDmg: number;
	switch (p.damageType) {
		case "unarmed": {
			const att = p.brawler ? (p.str + e.level) / 2 : 11;
			baseDmg = admg(att, 1, 1.125, e.def) * p.str * (e.level + p.str) / 256;
			break;
		}
		case "sword": {
			baseDmg = admg(p.attack, 1, 1.125, e.def) * (1 + p.str * (e.level + p.str) / 256);
			break;
		}
		case "pole": {
			baseDmg = admg(p.attack, 1, 1.125, e.mdef) * (1 + p.str * (e.level + p.str) / 256);
			break;
		}
		case "mace": {
			baseDmg = admg(p.attack, 1, 1.125, e.def) * (1 + p.mag * (e.level + p.mag) / 256);
			break;
		}
		case "katana": {
			baseDmg = admg(p.attack, 1, 1.125, e.def) * (1 + p.str * (e.level + p.mag) / 256);
			break;
		}
		case "hammer": {
			baseDmg = admg(p.attack, 0, 1.111, e.def) * (1 + p.str * (e.level + p.str) / 128);
			break;
		}
		case "dagger": {
			baseDmg = admg(p.attack, 1, 1.125, e.def) * (1 + p.str * (e.level + p.spd) / 218);
			break;
		}
		case "gun": {
			const v = p.attack * 1.0625;
			baseDmg = v * v;
			break;
		}
		default: {
			throw new Error();
		}
	}

	// damage modifiers
	let modifiedDamage = baseDmg;

	if (p.damageType === "gun" && e.resistGun) {
		modifiedDamage /= 8;
	}

	for (const element of AllElements) {
		if (p[`${element}Damage` as const]) {
			if (p[`${element}Bonus` as const]) {
				modifiedDamage *= 1.5;
			}
			modifiedDamage *= e[`${element}Reaction` as const];
		}
	}
	if (p.berserk) {
		modifiedDamage *= 1.5;
	}
	if (p.bravery) {
		modifiedDamage *= 1.3;
	}
	if (p.focus && e.percentHp === 100) {
		modifiedDamage *= 1.5;
	}
	if (p.adrenaline && e.percentHp < 20) {
		modifiedDamage *= 2;
	}

	// compute criticals and combos
	let comboDamage = modifiedDamage;

	const timings = AnimationTimings[p.animationType][e.character];
	let animationTime = timings.initialSwing;

	if (p.combo > 0) {
		/** Adjusted crit/combo rate */
		const cr = Math.min(1, p.combo * (p.genjiGloves ? 1.8 : 0.7) / 100);

		if (timings.comboSwing === 0 || p.damageType === "gun") {
			// critical
			// (damageType check is for fake Excalibur, etc.)
			comboDamage *= 1 + cr;
		} else {
			// combo
			let extraHits: number;
			const extraHitTime = timings.comboSwing;
			if (e.percentHp > 25) {
				extraHits = 1.873;
			} else if (e.percentHp > 12) {
				extraHits = 2.752;
			} else if (e.percentHp > 6) {
				extraHits = 4.509;
			} else {
				extraHits = 8.028;
			}
			animationTime += extraHits * extraHitTime * cr;
			comboDamage *= (1 + extraHits * cr);
		}
	}

	const chargeTime = calcChargeTime(p, e)
	const totalTime = chargeTime + animationTime;
	const dps = comboDamage / totalTime;
	return {
		dps,
		baseDmg,
		modifiedDamage,
		comboDamage,
		chargeTime,
		animationTime
	};
}
