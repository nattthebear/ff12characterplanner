import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { defaultEnvironment } from "./Profile.ts";
import type { Environment } from "./Profile.ts";
import PartyModel from "../model/PartyModel.ts";
import { Boards } from "../data/Boards.ts";
import { optimizeForCharacter, SECRET_WEAPONS } from "./OptimizeForCharacter.ts";
import type { ForcedGear } from "./OptimizeForCharacter.ts";
import type { OptimizerResult } from "./Optimize.ts";
import { Helm, BodyArmor } from "./equip/Armor.ts";
import Accessory from "./equip/Accessory.ts";
import Ammos from "./equip/Ammo.ts";

// Job board indices (see Boards.ts / the existing OptimizeForCharacter.test.ts Job enum).
const Job = { WhiteMage: 0, Uhlan: 1, Machinist: 2, Knight: 4, TimeBattlemage: 6, Foebreaker: 7, Archer: 8 } as const;

// Collect every result optimizeForCharacter yields for the given setup.
function collect(e: Environment, party: PartyModel, forced?: ForcedGear): OptimizerResult[] {
	const out: OptimizerResult[] = [];
	for (const result of optimizeForCharacter(e, party, forced)) {
		out.push(result);
	}
	return out;
}

// A simple environment for deterministic comparisons: no target defense, max level.
function testEnv(character = 0): Environment {
	return { ...defaultEnvironment, character, def: 0, mdef: 0, level: 99 };
}

function partyWithJob(job: number) {
	return new PartyModel().addJob(0, Boards[job]);
}

describe("ForcedGear", () => {
	it("default environment: secret gear disabled", () => {
		assert.equal(defaultEnvironment.allowCheaterGear, false);
	});

	it("secret weapons must only appear when allowCheaterGear is set", () => {
		const party = partyWithJob(Job.Foebreaker);
		const e = testEnv(0);

		const withoutSecret = collect(e, party);
		assert(!withoutSecret.some(r => SECRET_WEAPONS.has(r.doll.weapon.name)));

		const withSecret = collect({ ...e, allowCheaterGear: true }, party);
		assert(withSecret.some(r => SECRET_WEAPONS.has(r.doll.weapon.name)));
	});

	// Forcing an ability kind must restrict every yielded result to that kind.
	it("forced ability restricts the result ability kind", () => {
		const e = testEnv(0);
		const jobByAlg: Record<string, number> = {
			attack: Job.Knight,
			magick: Job.WhiteMage,
			technick: Job.Uhlan,
		};
		for (const [alg, job] of Object.entries(jobByAlg)) {
			const results = collect(e, partyWithJob(job), { ability: alg as ForcedGear["ability"] });
			assert(results.length > 0, `${alg} results exist`);
			assert(results.every(r => r.ability.alg === alg));
		}
	});

	// Forced item's entries must not be eliminated, even for a no-stat item.
	it("forced helm overrides pareto elimination", () => {
		const party = partyWithJob(Job.Knight);
		const e = testEnv(0);

		const unforced = collect(e, party, { ability: "attack" });
		assert(!unforced.some(r => r.doll.helm?.name === "Leather Cap"));

		const leatherCap = Helm.find(h => h.name === "Leather Cap")!;
		const forced = collect(e, party, { ability: "attack", helms: leatherCap });
		assert(forced.length > 0);
		assert(forced.every(r => r.doll.helm?.name === "Leather Cap"));
	});

	// Forced armor must appear on every result even though it would be filtered out otherwise.
	it("forced armor appears on all results", () => {
		const cottonShirt = BodyArmor.find(a => a.name === "Cotton Shirt")!;
		const forced = collect(testEnv(0), partyWithJob(Job.Knight), { ability: "attack", armors: cottonShirt });
		assert(forced.length > 0);
		assert(forced.every(r => r.doll.armor?.name === "Cotton Shirt"));
	});

	// Forced accessory must appear on every result.
	it("forced accessory appears on all results", () => {
		const genjiGloves = Accessory.find(a => a.name === "Genji Gloves")!;
		const forced = collect(testEnv(0), partyWithJob(Job.Knight), { ability: "attack", accessories: genjiGloves });
		assert(forced.length > 0);
		assert(forced.every(r => r.doll.accessory?.name === "Genji Gloves"));
	});

	// A forced ammo only applies to weapons whose animation type matches it (Artemis Arrows are
	// bow ammo); every other weapon keeps using the global ammo list.
	it("forced ammo applies only to matching weapons", () => {
		const artemis = Ammos.find(a => a.name === "Artemis Arrows")!;
		const results = collect(testEnv(0), partyWithJob(Job.Archer), { ability: "attack", ammos: artemis });

		const bows = results.filter(r => r.doll.weapon.animationType === "bow");
		assert(bows.length > 0, "bow results exist");
		assert(bows.every(r => r.doll.ammo?.name === "Artemis Arrows"));

		const nonBows = results.filter(r => r.doll.weapon.animationType !== "bow");
		assert(nonBows.every(r => r.doll.ammo?.name !== "Artemis Arrows"));
	});

	// Forcing ammo to null means the optimizer never equips ammo at all.
	it("null ammo disables ammo entirely", () => {
		const forced = collect(testEnv(0), partyWithJob(Job.Knight), { ability: "attack", ammos: null });
		assert(forced.length > 0);
		assert(forced.every(r => r.doll.ammo === undefined));
	});

	// "None" ammo filters out (bow/xbow/gun/handbomb).
	it("none ammo filters out weapons that require ammo", () => {
		const jobByType: Record<string, number> = {
			bow: Job.Archer,
			xbow: Job.TimeBattlemage,
			gun: Job.Machinist,
			handbomb: Job.Foebreaker,
		};
		for (const [type, job] of Object.entries(jobByType)) {
			const forced = collect(testEnv(0), partyWithJob(job), { ability: "attack", ammos: null });
			assert(forced.length > 0, `${type}: some results exist`);
			assert(forced.every(r => r.doll.weapon.animationType !== type), `${type}: no ammo-requiring weapons`);
		}
	});

	// Forcing every equipment slot to null must leave all armor slots empty.
	it("null helm/armor/accessory leave slots empty", () => {
		const forced = collect(testEnv(0), partyWithJob(Job.Knight), {
			ability: "attack",
			helms: null,
			armors: null,
			accessories: null,
		});
		assert(forced.length > 0);
		assert(forced.every(r => r.doll.helm === undefined && r.doll.armor === undefined && r.doll.accessory === undefined));
	});

	// Knight has the Focus and Adrenaline licenses. Pinning every gear slot except the weapon lets us compare the same build at different HP%
	const bareAttack: ForcedGear = { ability: "attack", ammos: null, helms: null, armors: null, accessories: null };
	const dpsByWeapon = (rs: OptimizerResult[]) => new Map(rs.map(r => [r.doll.weapon.name, r.dps.dps]));

	// Focus (+50% damage at full HP) must multiply dps by exactly 1.5 vs. a setup without Focus/Adrenaline active.
	it("focus at 100% HP yields exactly +50% dps", () => {
		const at = (hp: number) => collect({ ...testEnv(0), percentHp: hp }, partyWithJob(Job.Knight), bareAttack);
		const neutral = dpsByWeapon(at(99));
		const focused = dpsByWeapon(at(100));
		for (const [weapon, dps] of neutral) {
			assert(focused.has(weapon), `${weapon} missing from 100% HP results`);
			const ratio = focused.get(weapon)! / dps;
			assert(ratio >= 1.5 - 1e-6, `${weapon}: focus ratio ${ratio}, expected 1.5`);
		}
	});

	// Adrenaline (+100% damage at critical HP) must at least double dps vs. a setup without Focus/Adrenaline active. Combos scale further with low HP, so the ratio is >= 2.
	it("adrenaline at 1% HP yields at least +100% dps", () => {
		const at = (hp: number) => collect({ ...testEnv(0), percentHp: hp }, partyWithJob(Job.Knight), bareAttack);
		const neutral = dpsByWeapon(at(99));
		const adrenaline = dpsByWeapon(at(1));
		for (const [weapon, dps] of neutral) {
			assert(adrenaline.has(weapon), `${weapon} missing from 1% HP results`);
			const ratio = adrenaline.get(weapon)! / dps;
			assert(ratio >= 2, `${weapon}: adrenaline ratio ${ratio}, expected >= 2`);
		}
	});
});
