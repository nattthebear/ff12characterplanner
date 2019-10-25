import { defaultEnvironment } from "./Profile";
import PartyModel from "../model/PartyModel";
import { Boards } from "../data/Boards";
import { LicenseByName } from "../data/Licenses";
import { optimizeForCharacter } from "./OptimizeForCharacter";
import { OptimizerResult } from "./Optimize";

enum Job {
	WhiteMage,
	Uhlan,
	Machinist,
	RedBattlemage,
	Knight,
	Monk,
	TimeBattlemage,
	Foebreaker,
	Archer,
	BlackMage,
	Bushi,
	Shikari
};

enum Character {
	Vaan,
	Balthier,
	Fran,
	Basch,
	Ashe,
	Penelo
};

function resultToSnapshottable(r: OptimizerResult) {
	// OptimizerResult is snapshottable, but contains a bunch of fluff we don't need
	return {
		weapon: r.doll.weapon.name,
		ammo: r.doll.ammo && r.doll.ammo.name,
		helm: r.doll.helm && r.doll.helm.name,
		armor: r.doll.armor && r.doll.armor.name,
		accessory: r.doll.accessory && r.doll.accessory.name,
		dps: r.dps
	};
}

async function doTest(character: Character, job1: Job | null, job2: Job | null, ...licenses: string[]) {
	const start = performance.now();
	const env = {
		...defaultEnvironment,
		character,
		def: 0,
		mdef: 0,
		level: 99
	};
	let party = new PartyModel();
	if (job1 != null) {
		party = party.addJob(character, Boards[job1]);
	}
	if (job2 != null) {
		party = party.addJob(character, Boards[job2]);
	}
	for (const s of licenses) {
		party = party.add(character, LicenseByName(s));
	}
	let results: OptimizerResult[] = [];
	for await (const result of optimizeForCharacter(env, party)) {
		results.push(result);
	}
	results = results.filter(r => r.dps.dps > 0);
	results.sort((a, b) => b.dps.dps - a.dps.dps);
	const elapsed = performance.now() - start;
	return {
		elapsed,
		results: results.map(resultToSnapshottable)
	};
}



describe("OptimizeForCharacter", () => {
	it("basic test", async () => {
		expect(await doTest(Character.Vaan, Job.Knight, Job.Bushi)).toMatchSnapshot();
		expect(await doTest(Character.Basch, Job.Foebreaker, Job.Bushi)).toMatchSnapshot();
		expect(await doTest(Character.Balthier, Job.Shikari, Job.Bushi, "Quickening 2", "Quickening 3", "Quickening 4", "Zodiark")).toMatchSnapshot();
		expect(await doTest(Character.Vaan, Job.Monk, Job.Archer, "Shemhazai")).toMatchSnapshot();
		expect(await doTest(Character.Fran, Job.Monk, Job.Foebreaker)).toMatchSnapshot();
	});
});
