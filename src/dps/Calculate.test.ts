import { describe, it } from "node:test";
import * as assert from "node:assert/strict";

import { createProfile, defaultEnvironment, defaultProfile, type Environment, type Profile } from "./Profile.ts";
import { calculate } from "./Calculate.ts";
import { BaseCharacterStats } from "./BaseCharacterStats.ts";
import Weapon from "./equip/Weapon.ts";
import Accessory from "./equip/Accessory.ts";

const Mithuna = Weapon.find(w => w.name === "Mithuna")!;
const Karkata = Weapon.find(w => w.name === "Karkata")!;
const Bonebreaker = Weapon.find(w => w.name === "Bonebreaker")!;
const Dhanusha = Weapon.find(w => w.name === "Dhanusha")!;
const Tula = Weapon.find(w => w.name === "Tula")!;
const GenjiGloves = Accessory.find(a => a.name === "Genji Gloves")!;

function baseProfile(e: Environment): Profile {
	return { ...defaultProfile, ...BaseCharacterStats(e.character, e.level) };
}

describe("Calculate", () => {
	it("Genji Gloves don't affect gun crits", () => {
		const e: Environment = { ...defaultEnvironment, character: 0, level: 99, percentHp: 1 };
		const without = createProfile(baseProfile(e), { weapon: Mithuna });
		const withGloves = createProfile(baseProfile(e), { weapon: Mithuna, accessory: GenjiGloves });
		assert.equal(calculate(withGloves, e).dps, calculate(without, e).dps);
	});

	it("Genji Gloves don't affect fake-gun crit weapons", () => {
		const e: Environment = { ...defaultEnvironment, character: 0, level: 99, percentHp: 1 };
		const without = createProfile(baseProfile(e), { weapon: Bonebreaker });
		const withGloves = createProfile(baseProfile(e), { weapon: Bonebreaker, accessory: GenjiGloves });
		assert.equal(calculate(withGloves, e).dps, calculate(without, e).dps);
	});

	it("Genji Gloves don't affect bow crits", () => {
		const e: Environment = { ...defaultEnvironment, character: 0, level: 99, percentHp: 1 };
		const without = createProfile(baseProfile(e), { weapon: Dhanusha });
		const withGloves = createProfile(baseProfile(e), { weapon: Dhanusha, accessory: GenjiGloves });
		assert.equal(calculate(withGloves, e).dps, calculate(without, e).dps);
	});

	it("Genji Gloves don't affect xbow crits", () => {
		const e: Environment = { ...defaultEnvironment, character: 0, level: 99, percentHp: 1 };
		const without = createProfile(baseProfile(e), { weapon: Tula });
		const withGloves = createProfile(baseProfile(e), { weapon: Tula, accessory: GenjiGloves });
		assert.equal(calculate(withGloves, e).dps, calculate(without, e).dps);
	});

	it("Genji Gloves boosts combos", () => {
		const e: Environment = { ...defaultEnvironment, character: 0, level: 99, percentHp: 1 };
		const without = createProfile(baseProfile(e), { weapon: Karkata });
		const withGloves = createProfile(baseProfile(e), { weapon: Karkata, accessory: GenjiGloves });
		assert.ok(calculate(withGloves, e).dps > calculate(without, e).dps);
	});
});
