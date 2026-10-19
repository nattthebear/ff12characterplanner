import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Boards, PS2Board, ZodiacBoards } from "../data/Boards.ts";
import { Characters } from "../data/Characters.ts";
import { LicenseByName } from "../data/Licenses.ts";
import { PS2Licenses, PS2LicenseByName as license, PS2Espers, PS2Quickenings } from "../data/PS2Licenses.ts";
import { buildOptions } from "../component/DpsOptions.ts";
import { optimizeForCharacter } from "../dps/OptimizeForCharacter.ts";
import { defaultEnvironment } from "../dps/Profile.ts";
import { changeIndices } from "../store/State.ts";
import PartyModel, { Coloring } from "./PartyModel.ts";

describe("Original PS2 license board", () => {
	it("contains the complete 24x24 layout, original LP totals, and license families", () => {
		assert.equal(Boards.length, 13);
		assert.equal(ZodiacBoards.length, 12);
		assert.equal(PS2Board.rows.length, 24);
		assert.ok(PS2Board.rows.every(row => row.length === 24));
		assert.equal(PS2Board.lookup.size, 300);
		assert.equal(PS2Licenses.length, 300);
		assert.equal(new Set(PS2Licenses.map(l => l.fullName)).size, 300);
		assert.equal(PS2Licenses.filter(l => !l.limited).reduce((sum, l) => sum + l.cost, 0), 13180);
		assert.equal(PS2Espers.length, 13);
		assert.equal(PS2Espers.reduce((sum, l) => sum + l.cost, 0), 805);
		assert.equal(PS2Quickenings.length, 18);
		assert.ok(PS2Quickenings.every(q => q.cost === 50));
		for (const [family, count] of Object.entries({
			"White Magick": 8, "Black Magick": 8, "Time Magick": 7, "Green Magick": 7, "Arcane Magick": 7,
			"Light Armor": 12, "Mystic Armor": 12, "Heavy Armor": 10, Accessories: 20,
		})) assert.equal(PS2Licenses.filter(l => new RegExp(`^${family} \\d+$`).test(l.fullName)).length, count, family);
		assert.throws(() => license("Essentials"));
		assert.throws(() => license("Second Board"));
		assert.throws(() => license("Mithuna"));
		assert.equal(PS2Board.rows[4][17]!.value, license("Black Magick 1")); // R5
		assert.equal(PS2Board.rows[18][6]!.value, license("Smallswords")); // G19
		for (const position of PS2Board.lookup.values()) {
			for (const neighbor of position.adjacent) assert.ok(neighbor.adjacent.includes(position));
		}
	});

	it("uses original contents, costs, and corrected printed entries without altering Zodiac data", () => {
		const examples: [string, number, string[]][] = [
			["Black Magick 1", 15, ["Fire", "Thunder", "Blizzard"]],
			["Black Magick 7", 70, ["Flare", "Ardor"]],
			["White Magick 3", 30, ["Cura", "Raise", "Stona"]],
			["Guns 1", 30, ["Altair", "Capella"]],
			["Guns 5", 80, ["Antares", "Arcturus"]],
			["Guns 6", 150, ["Fomalhaut"]],
			["Heavy Armor 8", 55, ["Dragon Helm", "Dragon Mail"]],
			["Heavy Armor 9", 60, ["Magepower Shishak", "Maximillian"]],
			["Light Armor 12", 100, ["Dueling Mask", "Brave Suit"]],
			["Accessories 2", 15, ["Bangle", "Steel Gorget"]],
		];
		for (const [name, cost, items] of examples) {
			assert.equal(license(name).cost, cost, name);
			assert.deepEqual(license(name).grants!.what, items, name);
			assert.notEqual(license(name), LicenseByName(name));
		}
		assert.equal(license("+100 HP").cost, 50);
		assert.equal(license("Danjuro").cost, 110);
		assert.equal(license("Zodiac Spear").cost, 235);
		assert.equal(license("Rod of Faith").cost, 120);
		assert.equal(license("Mystic Armor 5").cost, 25);
		assert.equal(license("Axes & Hammers 5").cost, 35);
		assert.deepEqual(LicenseByName("Black Magick 1").grants!.what, ["Fire", "Thunder"]);
		assert.equal(LicenseByName("Guns 6").cost, 100);
	});

	it("starts all six characters with only their PS2 licenses, free and permanent", () => {
		const expected = [
			["Steal", "Light Armor 1", "Smallswords"],
			["Steal", "First Aid", "Guns 1", "Guns 2", "Shields 1", "Light Armor 1", "Light Armor 2", "Heavy Armor 1"],
			["White Magick 1", "Black Magick 1", "Steal", "Bows 1", "Bows 2", "Shields 1", "Light Armor 1", "Light Armor 2", "Heavy Armor 1"],
			["Libra", "Smallswords", "Swords 1", "Axes & Hammers 1", "Shields 1", "Shields 2", "Light Armor 1", "Heavy Armor 1", "Heavy Armor 2", "Accessories 3"],
			["White Magick 1", "White Magick 2", "Swords 1", "Swords 2", "Shields 1", "Shields 2", "Light Armor 1", "Mystic Armor 1", "Heavy Armor 1", "Heavy Armor 2", "Accessories 1", "Accessories 2"],
			["White Magick 1", "Daggers 1", "Light Armor 1"],
		];
		for (let c = 0; c < 6; c++) {
			let party = new PartyModel().addJob(c, PS2Board);
			const obtained = [...party.color(c)].filter(([, color]) => color === Coloring.OBTAINED).map(([l]) => l.fullName).sort();
			assert.deepEqual(obtained, expected[c].slice().sort(), Characters[c].name);
			assert.equal(party.getLpCount(c), 0);
			for (const l of party.getInnateLicenses(c)) {
				assert.ok(party.delete(c, l).has(c, l));
				assert.ok(PS2Board.lookup.has(l));
			}
			assert.ok(Characters[c].innateLicenses.every(l => !party.has(c, l)));
			assert.equal([...party.color(c)].filter(([l]) => PS2Board.lookup.has(l)).length, 300);
			party = party.removeAllJobs(c);
			assert.ok(Characters[c].innateLicenses.every(l => party.has(c, l)));
			assert.ok(PS2Licenses.every(l => !party.has(c, l)));
		}
	});

	it("spends PS2 LP, resets purchased licenses, and forbids mixing editions on one character", () => {
		const start = new PartyModel().addJob(0, PS2Board);
		const party = start.add(0, license("First Aid")); // directly below Vaan's Steal
		assert.equal(party.getLpCount(0), 20);
		assert.equal(party.delete(0, license("First Aid")).getLpCount(0), 0);
		assert.equal(start.addJob(0, ZodiacBoards[0]), start);
		const zodiac = new PartyModel().addJob(0, ZodiacBoards[0]);
		assert.equal(zodiac.addJob(0, PS2Board), zodiac);
		assert.equal(start.add(0, LicenseByName("Black Magick 1")), start);
		assert.equal(changeIndices(0, 1)({ party: start, characterIndex: 0, boardIndex: 0, qeActive: false, dpsActive: false, plannedParty: undefined }).boardIndex, 0);
	});

	it("shares each PS2 Quickening square across the party and limits each character to three", () => {
		let party = new PartyModel();
		for (let c = 0; c < 6; c++) party = party.addJob(c, PS2Board);
		for (let c = 0; c < 6; c++) {
			for (const q of PS2Quickenings.slice(c * 3, c * 3 + 3)) {
				party = party.add(c, q);
				assert.ok(party.has(c, q));
				assert.ok(party.isBlocked((c + 1) % 6, q));
			}
			assert.equal(PS2Quickenings.filter(q => party.has(c, q)).length, 3);
			assert.equal(party.add(c, PS2Quickenings[(c * 3 + 3) % 18]), party);
		}
		const q = PS2Quickenings[0];
		party = party.delete(0, q);
		assert.ok(!party.isBlocked(0, q));
		assert.ok(party.add(0, q).has(0, q));
	});

	it("shares PS2 Espers and round-trips PS2 and mixed-party URLs without changing legacy URLs", () => {
		let party = new PartyModel().addJob(0, PS2Board).addJob(1, PS2Board).addJob(2, ZodiacBoards[0]);
		party = party.add(0, license("Belias")).add(1, license("Guns 6")).add(1, PS2Quickenings[0]);
		assert.ok(party.has(0, license("Belias")));
		assert.equal(party.add(1, license("Belias")), party);
		const encoded = party.encode();
		const decoded = PartyModel.decode(encoded);
		assert.equal(decoded.encode(), encoded);
		for (let c = 0; c < 6; c++) assert.deepEqual([...decoded.color(c)], [...party.color(c)]);
		assert.equal(new PartyModel().encode(), "AA.AA.AA.AA.AA.AA");
		const legacy = "DQAAAAAAAAAAAAAAQA.AA.AA.AA.AA.AA"; // Vaan's original White Mage URL, including Essentials
		assert.equal(PartyModel.decode(legacy).getJob(0, 0), ZodiacBoards[0]);
		assert.equal(PartyModel.decode(legacy).isPS2(0), false);
		assert.equal(new PartyModel().addJob(0, ZodiacBoards[0]).encode(), legacy);
	});

	it("uses PS2 data in the DPS simulator and exposes all Mist claims", () => {
		const party = new PartyModel().addJob(0, PS2Board);
		assert.ok([...optimizeForCharacter({ ...defaultEnvironment, character: 0 }, party)].every(r => Number.isFinite(r.dps.dps)));
		assert.ok(buildOptions(defaultEnvironment, party, 0).weaponTypes.includes("sword"));
		assert.equal(party.getCovered(0).size, 31);
	});
});
