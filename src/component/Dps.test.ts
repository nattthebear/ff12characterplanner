import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { defaultEnvironment } from "../dps/Profile";
import PartyModel from "../model/PartyModel";
import { Boards } from "../data/Boards";
import { buildOptions } from "./Dps";
import { Helm, BodyArmor } from "../dps/equip/Armor";
import type { Equipment } from "../dps/equip/Equipment";
import Accessory from "../dps/equip/Accessory";

import type { Profile } from "../dps/Profile";

const ARCHER = 8;        // Bows
const MACHINIST = 2;     // Guns
const TIME_BATTLEMAGE = 6; // Crossbows
const KNIGHT = 4;        // every accessory license
const FOEBREAKER = 7;    // Hand-bombs
const WHITE_MAGE = 0;    // no ammo weapons
const UHLAN = 1;        // Heavy Armor

// ammo options for the given job and character
function ammos(job: number, character = 0, env = defaultEnvironment) {
	const party = new PartyModel().addJob(character, Boards[job]);
	return buildOptions(env, party, character).ammos;
}

// ammo options for the given character with the given job boards
function options(character = 0, env = defaultEnvironment, ...jobs: number[]) {
	const party = jobs.reduce((p, j) => p.addJob(character, Boards[j]), new PartyModel());
	return buildOptions(env, party, character).ammos;
}

// helm/armor/accessory options for a character with the given job board
function gear(job: number, character = 0, env = defaultEnvironment) {
	const party = new PartyModel().addJob(character, Boards[job]);
	return buildOptions(env, party, character);
}

// names of items whose license is in the given armor category (e.g. "Light Armor")
function categoryItems(items: Equipment[], category: string) {
	return items.filter(i => i.l?.fullName.startsWith(category)).map(i => i.name);
}

describe("ammo dropdown options", () => {
	it("bow license: shows arrows only", () => {
		const list = ammos(ARCHER);
		assert.ok(list.includes("Onion Arrows"));
		assert.ok(list.includes("Artemis Arrows"));
		assert.equal(list.filter(a => a.endsWith("Arrows")).length, list.length);
	});

	it("gun license: shows shots only", () => {
		const list = ammos(MACHINIST);
		assert.ok(list.includes("Onion Shot"));
		assert.ok(list.includes("Stone Shot"));
		assert.equal(list.filter(a => a.endsWith("Shot")).length, list.length);
	});

	it("crossbow license: shows bolts only", () => {
		const list = ammos(TIME_BATTLEMAGE);
		assert.ok(list.includes("Onion Bolts"));
		assert.ok(list.includes("Grand Bolts"));
		assert.equal(list.filter(a => a.endsWith("Bolts")).length, list.length);
	});

	it("no bow/gun/crossbow license: no ammo", () => {
		assert.deepEqual(ammos(WHITE_MAGE), []);
	});

	it("character with innate Guns 1 shows shots", () => {
		const list = ammos(0, 1);
		assert.ok(list.includes("Onion Shot"));
		assert.ok(list.includes("Artemis Arrows") === false);
	});

	it("hand-bombs license: shows bombs only", () => {
		const list = ammos(FOEBREAKER);
		assert.ok(list.includes("Onion Bombs"));
		assert.ok(list.includes("Castellanos"));
		assert.equal(list.filter(a => a.endsWith("Bombs") || a === "Castellanos").length, list.length);
	});

	it("no hand-bombs license: no bombs", () => {
		assert.ok(!ammos(ARCHER).some(a => a.endsWith("Bombs")));
		assert.ok(!ammos(WHITE_MAGE).some(a => a.endsWith("Bombs")));
	});
	it("combined bow+gun licenses: arrows and shots, no bolts or bombs", () => {
		const list = options(0, defaultEnvironment, ARCHER, MACHINIST);
		assert.ok(list.includes("Onion Arrows"));
		assert.ok(list.includes("Onion Shot"));
		assert.ok(!list.includes("Onion Bolts"));
		assert.ok(!list.includes("Onion Bombs"));
		assert.ok(list.every(a => a.endsWith("Arrows") || a.endsWith("Shot")));
	});

	it("combined gun+crossbow licenses: shots and bolts, no arrows or bombs", () => {
		const list = options(0, defaultEnvironment, MACHINIST, TIME_BATTLEMAGE);
		assert.ok(list.includes("Onion Shot"));
		assert.ok(list.includes("Onion Bolts"));
		assert.ok(!list.includes("Onion Arrows"));
		assert.ok(!list.includes("Onion Bombs"));
		assert.ok(list.every(a => a.endsWith("Bolts") || a.endsWith("Shot")));
	});

	it("allowCertainLicenses off: whole-board CERTAIN licenses no longer count", () => {
		const env = { ...defaultEnvironment, allowCertainLicenses: false };
		assert.deepEqual(ammos(ARCHER, 0, env), []);
	});

	it("allowCertainLicenses off: innate OBTAINED licenses still count", () => {
		const env = { ...defaultEnvironment, allowCertainLicenses: false };
		const list = ammos(WHITE_MAGE, 1, env);
		assert.ok(list.includes("Onion Shot"));
		assert.ok(list.every(a => a.endsWith("Shot")));
	});

	it("each weapon class shows only its own ammo class", () => {
		const classes = [
			[ARCHER, "Arrows"],
			[MACHINIST, "Shot"],
			[TIME_BATTLEMAGE, "Bolts"],
			[FOEBREAKER, "Bombs"],
		] as const;
		for (const [job, suffix] of classes) {
			const list = ammos(job);
			assert.ok(list.length > 0, `job ${job}`);
			const isOwnClass = (a: string) => a.endsWith(suffix) || (suffix === "Bombs" && a === "Castellanos");
			assert.ok(list.every(isOwnClass), `job ${job} leaked into another ammo class`);
		}
	});

});

describe("helm and armor dropdown options", () => {
	it("white mage: only Mystic Armor items", () => {
		const o = gear(WHITE_MAGE, 5);   // Penelo has innate Mystic Armor 1
		assert.deepEqual([...o.helms].sort(), categoryItems(Helm, "Mystic Armor").sort());
		assert.deepEqual([...o.armors].sort(), categoryItems(BodyArmor, "Mystic Armor").sort());
	});

	it("machinist: only Light Armor items", () => {
		const o = gear(MACHINIST);
		assert.deepEqual([...o.helms].sort(), categoryItems(Helm, "Light Armor").sort());
		assert.deepEqual([...o.armors].sort(), categoryItems(BodyArmor, "Light Armor").sort());
	});

	it("uhlan: only Heavy Armor items", () => {
		const o = gear(UHLAN, 3);   // Basch has innate Heavy Armor 1
		assert.deepEqual([...o.helms].sort(), categoryItems(Helm, "Heavy Armor").sort());
		assert.deepEqual([...o.armors].sort(), categoryItems(BodyArmor, "Heavy Armor").sort());
	});

	it("white mage: excludes light and heavy armor items", () => {
		const o = gear(WHITE_MAGE, 5);
		assert.ok(o.helms.includes("Circlet"));
		assert.ok(!o.helms.includes("Leather Cap"));
		assert.ok(!o.helms.includes("Leather Helm"));
		assert.ok(!o.armors.includes("Leather Clothing"));
		assert.ok(!o.armors.includes("Leather Armor"));
	});

	it("allowCertainLicenses off: only innate Light Armor 1 items are active", () => {
		const env = { ...defaultEnvironment, allowCertainLicenses: false };
		const o = gear(ARCHER, 0, env);
		assert.deepEqual(o.helms, ["Leather Cap"]);
		assert.deepEqual(o.armors, ["Leather Clothing"]);
	});

	it("allowCertainLicenses off: board items beyond the innate license are hidden", () => {
		const env = { ...defaultEnvironment, allowCertainLicenses: false };
		const o = gear(UHLAN, 3, env);   // Basch innate Heavy Armor 1, Uhlan board has Heavy Armor 2-12
		assert.deepEqual([...o.helms].sort(), ["Bronze Helm", "Leather Helm"].sort());
		assert.deepEqual([...o.armors].sort(), ["Bronze Armor", "Leather Armor"].sort());
	});
});
describe("accessory dropdown ranking", () => {
	// Knight's board grants every accessory license, so ranking is fully observable
	const list = gear(KNIGHT).accessories;
	const accessoryByName = new Map(Accessory.map(a => [a.name, a]));
	const tierOf = (name: string) => {
		const m = /^Accessories (\d+)$/.exec(accessoryByName.get(name)?.l?.fullName ?? "");
		return m ? +m[1] : undefined;
	};

	it("Ribbon and Genji Gloves are the top two accessories", () => {
		assert.deepEqual(list.slice(0, 2), ["Ribbon", "Genji Gloves"]);
	});

	it("Genji Gloves outranks every tiered accessory", () => {
		for (const name of list) {
			if (name === "Genji Gloves" || tierOf(name) === undefined) {
				continue;
			}
			assert.ok(list.indexOf(name) > list.indexOf("Genji Gloves"), `${name} should come after Genji Gloves`);
		}
	});

	it("tiered accessories are listed in descending license tier", () => {
		const tiers = list.map(tierOf).filter((t): t is number => t !== undefined);
		for (let i = 1; i < tiers.length; i++) {
			assert.ok(tiers[i - 1] >= tiers[i], `tier ${tiers[i]} out of order at position ${i}`);
		}
	});

	it("accessories without a license come last", () => {
		assert.deepEqual(list.slice(-3), ["Dawn Shard", "Goddess's Magicite", "Manufacted Nethicite"]);
	});
});
