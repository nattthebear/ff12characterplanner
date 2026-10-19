import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PS2Board, ZodiacBoards } from "../data/Boards.ts";
import { PS2Licenses, PS2LicenseByName as l, PS2Quickenings } from "../data/PS2Licenses.ts";
import PartyModel from "../model/PartyModel.ts";
import { changeEdition, type State } from "../store/State.ts";
import { dpsData } from "./DpsData.ts";
import { optimizeForCharacter } from "./OptimizeForCharacter.ts";
import { calculate } from "./Calculate.ts";
import { averageDamage } from "./ps2/Damage.ts";
import { createProfile, defaultEnvironment, defaultProfile, type Profile } from "./Profile.ts";
import { buildOptions } from "../component/DpsOptions.ts";

const data = dpsData(true);
const env = { ...defaultEnvironment, edition: "ps2" as const, character: 0, level: 99, def: 0, mdef: 0, percentHp: 100 };
const profile: Profile = { ...defaultProfile, str: 99, mag: 99, vit: 99, spd: 37 };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

describe("Original PS2 DPS", () => {
	it("has complete independent equipment catalogs with original license identities", () => {
		assert.equal(data.Weapon.length, 164);
		assert.equal(data.Helm.length, 60);
		assert.equal(data.BodyArmor.length, 60);
		const equipment = [...data.Weapon, ...data.Helm, ...data.BodyArmor, ...data.Accessory];
		assert.ok(equipment.every(item => !item.l || PS2Licenses.includes(item.l)));
		const families = /^(Smallswords|Swords|Greatswords|Daggers|Axes & Hammers|Katana|Ninja Swords|Spears|Poles|Bows|Crossbows|Guns|Hand-bombs|Maces|Measures|Rods|Staves|Light Armor|Mystic Armor|Heavy Armor|Accessories) /;
		for (const license of PS2Licenses.filter(v => families.test(v.fullName))) {
			const contents = license.grants!.what;
			assert.ok(Array.isArray(contents));
			for (const name of contents) {
				assert.ok(equipment.some(item => item.name === name && item.l === license), `${license.fullName}: ${name}`);
			}
		}
		const gun = data.Weapon.find(w => w.name === "Fomalhaut")!;
		assert.equal(gun.attack, 50);
		assert.equal(gun.chargeTime, 51);
		assert.equal(gun.l, l("Guns 6"));
		assert.notEqual(gun, dpsData(false).Weapon.find(w => w.name === "Fomalhaut"));
		assert.equal(data.Weapon.find(w => w.name === "Masamune")!.combo, 40);
		assert.equal(data.Weapon.find(w => w.name === "Cloud Staff")!.lightningBonus, undefined);
		assert.equal(data.Accessory.find(w => w.name === "Cat-ear Hood")!.spd, 50);
		assert.ok(!data.Accessory.some(w => w.name === "Germinas Boots"));
		assert.equal(data.BodyArmor.find(w => w.name === "Maximillian")!.spd, 6);
	});

	it("uses original growth, spell power, charge times and license contents", () => {
		assert.deepEqual(data.BaseCharacterStats(0, 99), { str: 77, mag: 64, vit: 61, spd: 37 });
		assert.deepEqual(data.BaseCharacterStats(2, 1), { str: 22, mag: 18, vit: 20, spd: 23 });
		for (const ability of [...data.Magicks, ...data.Technicks]) assert.ok(PS2Licenses.includes(ability.l!));
		const blizzard = data.Magicks.find(m => m.name === "Blizzard")!;
		assert.equal(blizzard.l, l("Black Magick 1"));
		assert.equal(blizzard.att, 25);
		assert.equal(blizzard.ct, 30);
		assert.equal(data.Magicks.find(m => m.name === "Ardor")!.l, l("Black Magick 7"));
		assert.equal(data.Magicks.find(m => m.name === "Curaja")!.att, 145);
		assert.equal(data.Technicks.find(m => m.name === "Telekinesis")!.ct, 50);
	});

	it("caps individual rolls, including partial caps and zero damage", () => {
		near(averageDamage(9000, 11000, 0, 1), 9749.49975);
		assert.equal(averageDamage(10, 20, 25, 1), 0);
		assert.equal(averageDamage(10000, 12000, 0, 1), 9999);
		assert.equal(averageDamage(100, 200, 0, 0), 0);
		const p = createProfile(profile, { weapon: data.Weapon.find(w => w.name === "Tournesol")! });
		const value = calculate(p, env);
		assert.equal(value.modifiedDamage, 9999);
		assert.ok(value.comboDamage > 9999); // multiple separately capped hits
		const critical = calculate({ ...p, damageType: "gun", animationType: "gun", attack: 200, combo: 100 }, env);
		assert.equal(critical.modifiedDamage, 9999);
		assert.equal(critical.comboDamage, 9999); // a critical cannot double the cap
	});

	it("applies PS2 Focus and Serenity bonuses and caps each AOE target separately", () => {
		const p = { ...profile, str: 20, mag: 20, damageType: "sword" as const, animationType: "sword" as const, attack: 20, chargeTime: 35 };
		const normal = calculate(p, env).modifiedDamage;
		near(calculate({ ...p, focus: true }, env).modifiedDamage / normal, 1.2);
		near(calculate({ ...p, focus: true }, { ...env, edition: "tza" }).modifiedDamage / normal, 1.5);
		const fire = { ...p, ability: data.Magicks.find(m => m.name === "Fire")! };
		near(calculate({ ...fire, serenity: true }, env).modifiedDamage / calculate(fire, env).modifiedDamage, 1.2);
		const cure = { ...fire, ability: data.Magicks.find(m => m.name === "Cure")! };
		near(calculate({ ...cure, serenity: true }, { ...env, undead: true }).modifiedDamage / calculate(cure, { ...env, undead: true }).modifiedDamage, 1.5);
		const scathe = calculate({ ...profile, ability: data.Magicks.find(m => m.name === "Scathe")! }, { ...env, targetCount: 3 });
		assert.equal(scathe.modifiedDamage, 9999);
		assert.equal(scathe.comboDamage, 29997);
	});

	it("uses PS2 innate licenses and offers PS2 gear for all six characters", () => {
		let party = new PartyModel();
		for (let c = 0; c < 6; c++) party = party.addJob(c, PS2Board);
		const obtained = { ...defaultEnvironment, allowCertainLicenses: false, character: 2 };
		const fran = [...optimizeForCharacter(obtained, party)];
		assert.ok(fran.some(r => r.ability.name === "Blizzard"));
		assert.ok(!fran.some(r => r.ability.name === "Fira"));
		for (let c = 0; c < 6; c++) {
			const results = [...optimizeForCharacter({ ...defaultEnvironment, character: c }, party, { ability: "attack", weaponType: "gun" })];
			assert.ok(results.length > 0);
			assert.ok(results.every(r => Number.isFinite(r.dps.dps) && r.dps.modifiedDamage <= 9999));
			assert.ok(results.every(r => r.doll.ammo && data.Ammos.includes(r.doll.ammo)));
			assert.ok(results.every(r => data.Weapon.includes(r.doll.weapon)));
			assert.ok(buildOptions(defaultEnvironment, party, c).accessories.includes("Cat-ear Hood"));
		}
		assert.deepEqual([...optimizeForCharacter({ ...defaultEnvironment, character: 0 }, party, { ability: "attack", weaponType: "gun", ammos: null })], []);
	});

	it("switches every board and restores both editions' licenses and Mist assignments", () => {
		const zodiac = new PartyModel().addJob(0, ZodiacBoards[0]).addJob(0, ZodiacBoards[1]);
		let state: State = { party: zodiac, characterIndex: 0, boardIndex: 1, qeActive: false, dpsActive: true, plannedParty: undefined };
		state = changeEdition("ps2")(state);
		assert.ok(Array.from({ length: 6 }, (_, c) => state.party.isPS2(c) && !state.party.getJob(c, 1)).every(Boolean));
		assert.equal(state.boardIndex, 0);
		state = { ...state, party: state.party.add(0, PS2Quickenings[0]).add(1, l("Belias")) };
		const ps2 = state.party.encode();
		state = changeEdition("tza")(state);
		assert.equal(state.party.encode(), zodiac.encode());
		state = changeEdition("ps2")(state);
		assert.equal(state.party.encode(), ps2);
		assert.ok(state.party.isBlocked(1, PS2Quickenings[0]));
		assert.ok(state.party.isBlocked(0, l("Belias")));
	});
});
