import type { Environment, Profile } from "../Profile.ts";

/** Average each roll after applying the original 9,999 cap, before misses, combos or AOE.
 * Integrating the capped distribution matters when only some rolls reach the cap.
 * Like the existing simulator, this models continuous rolls rather than integer rounding.+ */
export function averageDamage(lo: number, hi: number, def: number, multiplier: number, cap = 9999, squared = false) {
	if (multiplier <= 0 || hi <= lo) return 0;
	const start = Math.max(lo, squared ? 0 : def);
	const threshold = squared ? Math.sqrt(cap / multiplier) : def + cap / multiplier;
	const end = Math.max(start, Math.min(hi, threshold));
	const integral = squared
		? (end ** 3 - start ** 3) / 3
		: ((end - def) ** 2 - (start - def) ** 2) / 2;
	return (multiplier * integral + (Number.isFinite(cap) ? cap * Math.max(0, hi - Math.max(lo, threshold)) : 0)) / (hi - lo);
}

export function attackDamage(p: Profile, e: Environment, multiplier: number, cap = 9999) {
	let attack = p.attack;
	let def = e.def;
	let stat = 1;
	let low = 1;
	let high = 1.125;
	switch (p.damageType) {
		case "unarmed":
			attack = p.brawler ? (p.str + e.level) / 2 : 11;
			stat = p.str * (e.level + p.str) / 256;
			break;
		case "pole":
			def = e.mdef;
			stat = 1 + p.str * (e.level + p.str) / 256;
			break;
		case "sword": stat = 1 + p.str * (e.level + p.str) / 256; break;
		case "mace": stat = 1 + p.mag * (e.level + p.mag) / 256; break;
		case "katana": stat = 1 + p.str * (e.level + p.mag) / 256; break;
		case "dagger": stat = 1 + p.str * (e.level + p.spd) / 218; break;
		case "hammer":
			low = 0;
			high = 1.111;
			stat = 1 + p.str * (e.level + p.vit) / 128;
			break;
		case "gun": return averageDamage(attack, attack * high, 0, multiplier, cap, true);
	}
	return averageDamage(attack * low, attack * high, def, multiplier * stat, cap);
}
