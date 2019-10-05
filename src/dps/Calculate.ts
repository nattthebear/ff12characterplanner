import { Profile, Environment, AllElements } from "./Profile";
import { AttackFrames } from "./AttackFrames";

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

function chargeTime(p: Profile, e: Environment) {
	const ct = p.chargeTime;
	let csmod: number;
	if (p.spd <= 23) {
		csmod = 4.75;
	} else if (p.spd <= 25) {
		csmod = 4.65;
	} else if (p.spd <= 28) {
		csmod = 4.55;
	} else if (p.spd <= 31) {
		csmod = 4.45;
	} else if (p.spd <= 35) {
		csmod = 4.35;
	} else if (p.spd <= 40) {
		csmod = 4.25;
	} else if (p.spd <= 46) {
		csmod = 4.15;
	} else if (p.spd <= 56) {
		csmod = 4.05;
	} else if (p.spd <= 72) {
		csmod = 3.95;
	} else if (p.spd <= 93) {
		csmod = 3.85;
	} else {
		csmod = 3.75;
	}
	const ran = 0.25;
	let lmod = 1;
	if (e.swiftness1) {
		lmod -= 0.12;
	}
	if (e.swiftness2) {
		lmod -= 0.12;
	}
	if (e.swiftness3) {
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

/** Calculates the final average DPS value for this situation */
export function calculate(p: Profile, e: Environment) {
	let base: number;
	switch (p.damageType) {
		case "unarmed": {
			const att = p.brawler ? (p.str + e.level) / 2 : 11;
			base = admg(att, 1, 1.125, e.def) * p.str * (e.level + p.str) / 256;
			break;
		}
		case "sword": {
			base = admg(p.attack, 1, 1.125, e.def) * (1 + p.str * (e.level + p.str) / 256);
			break;
		}
		case "pole": {
			base = admg(p.attack, 1, 1.125, e.mdef) * (1 + p.str * (e.level + p.str) / 256);
			break;
		}
		case "mace": {
			base = admg(p.attack, 1, 1.125, e.def) * (1 + p.mag * (e.level + p.mag) / 256);
			break;
		}
		case "katana": {
			base = admg(p.attack, 1, 1.125, e.def) * (1 + p.str * (e.level + p.mag) / 256);
			break;
		}
		case "hammer": {
			base = admg(p.attack, 0, 1.111, e.def) * (1 + p.str * (e.level + p.str) / 128);
			break;
		}
		case "dagger": {
			base = admg(p.attack, 1, 1.125, e.def) * (1 + p.str * (e.level + p.spd) / 218);
			break;
		}
		case "gun": {
			const v = p.attack * 1.0625;
			base = v * v;
			if (e.resistGun) {
				base /= 8;
			}
			break;
		}
		default: {
			throw new Error();
		}
	}

	const [initialSwingTime, ...comboTimes] = AttackFrames[p.animationType][e.character];
	let animationTime = initialSwingTime;

	// compute criticals and combos
	if (p.combo > 0) {
		/** Adjusted crit/combo rate */
		const cr = p.combo * (p.genjiGloves ? 0.7 : 1.8);

		if (comboTimes.length === 0 || p.damageType === "gun") {
			// critical
			base *= 1 + cr;
		} else {
			// combo
			let extraHits: number;
			const extraHitTime = comboTimes.reduce((acc, val) => acc + val, 0) / comboTimes.length;
			if (e.percentHp > 25) {
				extraHits = 1.873;
			} else if (e.percentHp > 12) {
				extraHits = 2.752;
			} else if (e.percentHp > 6) {
				extraHits = 4.509;
			} else {
				extraHits = 8.028;
			}
			animationTime += extraHits * extraHitTime;
			base = base * (1 + extraHits);
		}
	}

	// damage modifiers
	for (const element of AllElements) {
		if ((p as any)[element + "Damage"]) {
			if ((p as any)[element + "Bonus"]) {
				base *= 1.5;
			}
			base *= (e as any)[element + "Reaction"];
		}
	}
	if (p.berserk) {
		base *= 1.5;
	}
	if (p.bravery) {
		base *= 1.3;
	}
	if (p.focus && e.percentHp === 100) {
		base *= 1.5;
	}
	if (p.adrenaline && e.percentHp < 20) {
		base *= 2;
	}

	const totalTime = chargeTime(p, e) + animationTime;
	return base / totalTime; // DPS
}