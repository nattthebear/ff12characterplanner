import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { defaultEnvironment, type Environment, defaultProfile } from "../dps/Profile.ts";
import PartyModel, { Coloring } from "../model/PartyModel.ts";
import { Boards } from "../data/Boards.ts";
import { buildOptions } from "./DpsOptions.ts";
import { SECRET_WEAPONS } from "../dps/OptimizeForCharacter.ts";
import { Characters } from "../data/Characters.ts";
import { LicenseByName } from "../data/Licenses.ts";
import Weapon from "../dps/equip/Weapon.ts";
import type { AnimationClass } from "../dps/Profile.ts";
import { Helm, BodyArmor } from "../dps/equip/Armor.ts";
import type { Equipment } from "../dps/equip/Equipment.ts";
import Accessory from "../dps/equip/Accessory.ts";

import { calculate } from "../dps/Calculate.ts";
import Magicks from "../dps/ability/Magick.ts";
import Technicks from "../dps/ability/Technick.ts";
import type { Profile } from "../dps/Profile.ts";

const ARCHER = 8;        // Bows
const MACHINIST = 2;     // Guns
const TIME_BATTLEMAGE = 6; // Crossbows
const KNIGHT = 4;        // every accessory license
const FOEBREAKER = 7;    // Hand-bombs
const WHITE_MAGE = 0;    // no ammo weapons
const UHLAN = 1;        // Heavy Armor

const noCheaterGearEnvironment = { ...defaultEnvironment, allowCheaterGear: false };
// ammo for secret gear considered if active (Seitengrat adds bows for everyone)
const cheaterGearEnvironment = { ...defaultEnvironment, allowCheaterGear: true };

// ammo options for the given job and character
function ammos(job: number, character = 0, env = noCheaterGearEnvironment) {
	const party = new PartyModel().addJob(character, Boards[job]);
	return buildOptions(env, party, character).ammos;
}

// ammo options for the given character with the given job boards
function options(character = 0, env = noCheaterGearEnvironment, ...jobs: number[]) {
	const party = jobs.reduce((p, j) => p.addJob(character, Boards[j]), new PartyModel());
	return buildOptions(env, party, character).ammos;
}

// helm/armor/accessory options for a character with the given job board
function gear(job: number, character = 0, env = noCheaterGearEnvironment) {
	const party = new PartyModel().addJob(character, Boards[job]);
	return buildOptions(env, party, character);
}

// names of items whose license is in the given armor category (e.g. "Light Armor")
function categoryItems(items: Equipment[], category: string) {
	return items.filter(i => i.l?.fullName.startsWith(category)).map(i => i.name);
}

describe("weapon dropdown options", () => {
	// the innate weapon license of each character
	const INNATE: [number, AnimationClass][] = [
		[0, "dagger"],   // Vaan: Daggers 1
		[1, "gun"],      // Balthier: Guns 1
		[2, "bow"],      // Fran: Bows 1
		[3, "sword"],    // Basch: Swords 2
		[4, "sword"],    // Ashe: Swords 2
		[5, "dagger"],   // Penelo: Daggers 1
	];

	function weaponTypes(character: number, env = noCheaterGearEnvironment, ...jobs: number[]) {
		const party = jobs.reduce((p, j) => p.addJob(character, Boards[j]), new PartyModel());
		return buildOptions(env, party, character).weaponTypes;
	}

	// the dropdown offers equippable weapon types only, secret gear only if enabled
	function activeTypes(party: PartyModel, character: number, env: Environment) {
		const colors = party.color(character);
		const canEquip = (w: Equipment) => !w.l || colors.get(w.l) === Coloring.OBTAINED || colors.get(w.l) === Coloring.CERTAIN;
		return new Set(Weapon.filter(w => canEquip(w) && (env.allowCheaterGear || !SECRET_WEAPONS.has(w.name))).map(w => w.animationType!));
	}

	it("no jobs: each character's innate weapon type is active", () => {
		for (const [character, type] of INNATE) {
			assert.ok(weaponTypes(character).includes(type), `${Characters[character].name}: ${type}`);
		}
	});

	it("a job keeps the innate weapon type active (same or different type)", () => {
		for (const [character, innate] of INNATE) {
			for (let job = 0; job < Boards.length; job++) {
				assert.ok(weaponTypes(character, noCheaterGearEnvironment, job).includes(innate),
					`${Characters[character].name} + ${Boards[job].name}: ${innate} stays active`);
			}
		}
	});

	it("a job makes every active weapon type selectable", () => {
		for (let character = 0; character < Characters.length; character++) {
			for (let job = 0; job < Boards.length; job++) {
				const party = new PartyModel().addJob(character, Boards[job]);
				const types = weaponTypes(character, noCheaterGearEnvironment, job);
				for (const type of activeTypes(party, character, noCheaterGearEnvironment)) {
					assert.ok(types.includes(type), `${Characters[character].name} + ${Boards[job].name}: ${type}`);
				}
			}
		}
	});

	it("only equippable weapon types are selectable", () => {
		for (let character = 0; character < Characters.length; character++) {
			for (let job = 0; job < Boards.length; job++) {
				const party = new PartyModel().addJob(character, Boards[job]);
				const types = weaponTypes(character, noCheaterGearEnvironment, job);
				const canEquip = activeTypes(party, character, cheaterGearEnvironment);
				for (const type of types) {
					assert.ok(canEquip.has(type), `${Characters[character].name} + ${Boards[job].name}: ${type} is not equippable`);
				}
			}
		}
	});

	it("secret gear on: types are selectable for everyone", () => {
		for (let character = 0; character < Characters.length; character++) {
			const types = weaponTypes(character, cheaterGearEnvironment);
			assert.ok(types.includes("bow"), `${Characters[character].name}: bow (Seitengrat)`);
			assert.ok(types.includes("bigsword"), `${Characters[character].name}: bigsword (Wyrmhero Blade)`);
			assert.ok(types.includes("sword"), `${Characters[character].name}: sword (Great Trango)`);
		}
	});

	it("secret gear off: no secret-only weapon types without a license", () => {
		// secret weapons: Seitengrat (bow), Great Trango (sword), Wyrmhero Blade (bigsword)
		const SECRET_TYPES = ["bow", "sword", "bigsword"] as const;
		for (let character = 0; character < Characters.length; character++) {
			const types = weaponTypes(character, noCheaterGearEnvironment);
			for (const secretType of SECRET_TYPES) {
				assert.ok(types.includes(INNATE[character][1]) || !types.includes(secretType),
					`${Characters[character].name}: no ${secretType} without secret gear`);
			}
		}
	});

	it("ninja blades (require quickening): license obtained, reachable, or gated", () => {
		const shikari = new PartyModel().addJob(0, Boards[11]); // Shikari
		const weaponTypesOf = (party: PartyModel, allLicenses: boolean) =>
			buildOptions({ ...noCheaterGearEnvironment, allowCertainLicenses: allLicenses }, party, 0).weaponTypes;

		// "POSSIBLE" license: gated behind an unchosen quickening, not selectable
		for (const allLicenses of [true, false]) {
			assert.ok(!weaponTypesOf(shikari, allLicenses).includes("ninja"), `gated ninja with allLicenses=${allLicenses}`);
		}

		// "CERTAIN" license: selectable only with allLicenses
		const unlocked = shikari.add(0, LicenseByName("Quickening 1"));
		for (const allLicenses of [true, false]) {
			assert.equal(weaponTypesOf(unlocked, allLicenses).includes("ninja"), allLicenses,
				`reachable ninja with allLicenses=${allLicenses}`);
		}

		// "OBTAINED" license: always selectable
		const obtained = shikari.add(0, LicenseByName("Quickening 1")).add(0, LicenseByName("Ninja Swords 1"));
		for (const allLicenses of [true, false]) {
			assert.ok(weaponTypesOf(obtained, allLicenses).includes("ninja"), `obtained ninja with allLicenses=${allLicenses}`);
		}
	});

	it("bow license adds bow to the weapon types", () => {
		assert.ok(gear(ARCHER).weaponTypes.includes("bow"));
	});

	it("unarmed leads the weapon types, right after Auto", () => {
		assert.equal(gear(WHITE_MAGE).weaponTypes[0], "unarmed");
	});
});

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
		const list = options(0, noCheaterGearEnvironment, ARCHER, MACHINIST);
		assert.ok(list.includes("Onion Arrows"));
		assert.ok(list.includes("Onion Shot"));
		assert.ok(!list.includes("Onion Bolts"));
		assert.ok(!list.includes("Onion Bombs"));
		assert.ok(list.every(a => a.endsWith("Arrows") || a.endsWith("Shot")));
	});

	it("combined gun+crossbow licenses: shots and bolts, no arrows or bombs", () => {
		const list = options(0, noCheaterGearEnvironment, MACHINIST, TIME_BATTLEMAGE);
		assert.ok(list.includes("Onion Shot"));
		assert.ok(list.includes("Onion Bolts"));
		assert.ok(!list.includes("Onion Arrows"));
		assert.ok(!list.includes("Onion Bombs"));
		assert.ok(list.every(a => a.endsWith("Bolts") || a.endsWith("Shot")));
	});

	it("allowCertainLicenses off: whole-board CERTAIN licenses no longer count", () => {
		const env = { ...noCheaterGearEnvironment, allowCertainLicenses: false};
		assert.deepEqual(ammos(ARCHER, 0, env), []);
	});

	it("allowCertainLicenses off: innate OBTAINED licenses still count", () => {
		const env = { ...noCheaterGearEnvironment, allowCertainLicenses: false };
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

	it("cheater gear on: arrows selectable without any bow license", () => {
		const list = buildOptions(cheaterGearEnvironment, new PartyModel(), 5).ammos;
		assert.ok(list.includes("Onion Arrows"));
		assert.ok(list.every(a => a.endsWith("Arrows")));
	});

	it("cheater gear on: Balthier Monk/Black Mage can select arrows", () => {
		const party = new PartyModel().addJob(1, Boards[5]).addJob(1, Boards[9]);
		const list = buildOptions(cheaterGearEnvironment, party, 1).ammos;
		assert.ok(list.includes("Onion Arrows"));
		assert.ok(list.includes("Onion Shot"));
		assert.ok(!list.includes("Onion Bolts"));
		assert.ok(!list.includes("Onion Bombs"));
	});

	it("cheater gear off: no arrows without a bow license", () => {
		assert.deepEqual(buildOptions(noCheaterGearEnvironment, new PartyModel(), 5).ammos, []);
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


function profileBody(env = defaultEnvironment): Profile {
	return {
		...defaultProfile,
		animationType: "rod",
		str: 60, mag: 99, vit: 60, spd: 60,
		berserk: env.berserk, haste: env.haste, bravery: env.bravery, faith: env.faith,
	};
}

function profileWithMagick(name: string, env = defaultEnvironment): Profile {
	return { ...profileBody(env), ability: Magicks.find(m => m.name === name)! };
}

function profileWithTechnick(name: string, env = defaultEnvironment): Profile {
	return { ...profileBody(env), ability: Technicks.find(t => t.name === name)! };
}

describe("aoe dps per target count", () => {
	it("aoe magick: aoeDps has 7 entries, one per target count, current one matches dps", () => {
		const env = { ...defaultEnvironment, targetCount: 3 };
		const result = calculate(profileWithMagick("Firaga", env), env);
		assert.equal(result.aoeDps?.length, 7);
		assert.ok(result.aoeDps![0] < result.aoeDps![6]);
		assert.ok(Math.abs(result.aoeDps![2] - result.dps) < 1e-9);
	});

	for (const name of ["Firaga", "Darkga", "Ardor"]) {
		it(`${name}: aoeDps matches the formula for each of 1..7 targets`, () => {
			const env = defaultEnvironment;
			const result = calculate(profileWithMagick(name, env), env);
			const m = Magicks.find(m => m.name === name)!;
			const { aoeDps, nonAvoidedDamage, chargeTime } = result;
			const baseAnim = m.at / 30;
			const addHit = m.aoe! / 30;
			for (let n = 1; n <= 7; n++) {
				const anim = baseAnim + (n - 1) * addHit;
				const expected = nonAvoidedDamage * n / (chargeTime + anim);
				assert.ok(Math.abs(aoeDps![n - 1] - expected) < 1e-9,
					`${name} target count ${n}: expected ${expected}, actual ${aoeDps![n - 1]}`);
			}
		});
	}

	it("single-target magick: no aoeDps", () => {
		const result = calculate(profileWithMagick("Fire"), defaultEnvironment);
		assert.equal(result.aoeDps, undefined);
	});

	// in seconds: anim(n) = 2.5 + (n>2 ? 1 : 0) * (n-2) * 0.667
	it("gil toss: damage is split, not scaled, with target count", () => {
		const result = calculate(profileWithTechnick("Gil Toss"), defaultEnvironment);
		assert.equal(result.aoeDps?.length, 7);
		// the 75-tick animation floor absorbs the first extra target's time, so 1 and 2 targets tie
		assert.ok(Math.abs(result.aoeDps![0] - result.aoeDps![1]) < 1e-9);
		// flat total damage: extra targets only lengthen the cast, so dps only drops
		assert.ok(result.aoeDps![6] < result.aoeDps![0]);
	});

	it("gil toss: aoeDps matches dps for the configured target count", () => {
		const env = { ...defaultEnvironment, targetCount: 3 };
		const result = calculate(profileWithTechnick("Gil Toss", env), env);
		assert.ok(Math.abs(result.aoeDps![2] - result.dps) < 1e-9);
	});

	it("horology (technick aoe, no gil-toss split): damage scales with target count", () => {
		const result = calculate(profileWithTechnick("Horology"), defaultEnvironment);
		assert.equal(result.aoeDps?.length, 7);
		// no animation floor: every extra target adds dps
		assert.ok(result.aoeDps![0] < result.aoeDps![1]);
		assert.ok(result.aoeDps![0] < result.aoeDps![6]);
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
