import { defaultEnvironment, Environment } from "./Profile";
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
		ammo: r.doll.ammo?.name,
		helm: r.doll.helm?.name,
		armor: r.doll.armor?.name,
		accessory: r.doll.accessory?.name,
		dps: r.dps
	};
}

interface TestParameters {
	character: Character,
	job?: Job,
	job2?: Job,
	licenses?: string[],
	env?: Partial<Environment>,
}

function doTest({ character, job, job2, licenses, env }: TestParameters) {
	const e: Environment = {
		...defaultEnvironment,
		character: character,
		def: 0,
		mdef: 0,
		level: 99,
		...env,
	};
	let party = new PartyModel();
	if (job != null) {
		party = party.addJob(character, Boards[job]);
	}
	if (job2 != null) {
		party = party.addJob(character, Boards[job2]);
	}
	for (const s of licenses || []) {
		party = party.add(character, LicenseByName(s));
	}
	let results: OptimizerResult[] = [];
	for (const result of optimizeForCharacter(e, party)) {
		results.push(result);
	}
	return results.filter(r => r.dps.dps > 0)
		.sort((a, b) => b.dps.dps - a.dps.dps)
		.map(resultToSnapshottable);
}

function timeTest(pp: TestParameters) {
	const start = performance.now();
	for (let i = 0; i < 350; i++) {
		doTest(pp);
	}
	return performance.now() - start;
}

describe("OptimizeForCharacter", () => {
	it("basic test", () => {
		expect(doTest({
			character: Character.Vaan, job: Job.Knight, job2: Job.Bushi,
		})).toMatchSnapshot();
		expect(doTest({
			character: Character.Basch, job: Job.Foebreaker, job2: Job.Bushi,
		})).toMatchSnapshot();
		expect(doTest({
			character: Character.Balthier, job: Job.Shikari, job2: Job.Bushi,
			licenses: ["Quickening 2", "Quickening 3", "Quickening 4", "Zodiark"]
		})).toMatchSnapshot();
		expect(doTest({
			character: Character.Vaan, job: Job.Monk, job2: Job.Archer,
			licenses: ["Shemhazai"]
		})).toMatchSnapshot();
		expect(doTest({
			character: Character.Fran, job: Job.Monk, job2: Job.Foebreaker,
		})).toMatchSnapshot();
	});

	it("something brawler", () => {
		expect(doTest({
			character: Character.Penelo,
			job: Job.Knight,
			env: {
				level: 53,
				def: 40
			}
		})).toMatchSnapshot();
	});

	it("machinist + dark robes", () => {
		expect(doTest({
			character: Character.Penelo,
			job: Job.Machinist,
			job2: Job.RedBattlemage,
		})).toMatchSnapshot();		
	});

	it("vit optimization", () => {
		expect(doTest({
			character: Character.Ashe,
			job: Job.Foebreaker,
			job2: Job.BlackMage,
			licenses: ["Adrammelech", "Quickening 4"],
			env: {
				level: 99,
				def: 10,
			}
		})).toMatchSnapshot();
		expect(doTest({
			character: Character.Ashe,
			job: Job.BlackMage,
			job2: Job.Monk,
			licenses: ["Adrammelech", "Quickening 4"],
			env: {
				level: 99,
				def: 10,
			}
		})).toMatchSnapshot();
	});

	it("elemental tests", () => {
		const envs: Partial<Environment>[] = [
			{ fireReaction: 2 },
			{ fireReaction: 0.5 },
			{ iceReaction: 2 },
			{ iceReaction: 0 },
			{ windReaction: 2 },
			{ lightningReaction: 2 },
			{ earthReaction: 2 },
			{ waterReaction: 2 },
			{ waterReaction: 0 },
			{ waterReaction: 0.5 },
			{ darkReaction: 0.5 },
			{ darkReaction: 0 },
		];
		for (const env of envs) {
			expect(doTest({ character: Character.Balthier, job: Job.Archer, job2: Job.Machinist, env })).toMatchSnapshot();
		}
	});

	it("a tricky elemental test", () => {
		// For the Aevis Killer, Earth Arrows are the best here, but the old optimizer doesn't see that.
		expect(doTest({ character: Character.Penelo, job: Job.Archer, env: { def: 32, earthReaction: 0.5 } })).toMatchSnapshot();
	});

	it("weather", () => {
		expect(doTest({ character: Character.Ashe, job: Job.Machinist, job2: Job.BlackMage, env: { weather: "windy" } })).toMatchSnapshot();
		expect(doTest({ character: Character.Ashe, job: Job.Archer, job2: Job.Foebreaker,
			env: {
				weather: "windy",
				def: 20,
				level: 70,
				iceReaction: 0, lightningReaction: 0, waterReaction: 0, windReaction: 0, earthReaction: 0, holyReaction: 0, darkReaction: 0,
			}
		})).toMatchSnapshot();
		expect(doTest({ character: Character.Ashe, job: Job.Archer, job2: Job.Foebreaker,
			env: {
				weather: "rainy",
				def: 20,
				level: 90,
				iceReaction: 0, lightningReaction: 0, waterReaction: 0, windReaction: 0, earthReaction: 0, holyReaction: 0, darkReaction: 0,
			}
		})).toMatchSnapshot();
		expect(doTest({ character: Character.Ashe, job: Job.Archer, job2: Job.Bushi,
			env: {
				weather: "rainy",
				def: 20,
				level: 90,
				iceReaction: 0, lightningReaction: 0, waterReaction: 0, windReaction: 0, earthReaction: 0, holyReaction: 0, darkReaction: 0,
			}
		})).toMatchSnapshot();
	});

	it("wyrmhero bravery", () => {
		expect(doTest({ character: Character.Fran, job: Job.Monk, env: { bravery: false } })).toMatchSnapshot();
		expect(doTest({ character: Character.Fran, job: Job.WhiteMage, env: { bravery: false } })).toMatchSnapshot();
	});

	it("Perf tests", () => {
		const t1 = timeTest({ character: Character.Basch, job: Job.Knight, job2: Job.Foebreaker });
		const t2 = timeTest({ character: Character.Basch, job: Job.Bushi, job2: Job.WhiteMage });
		expect ([t1, t2]).toMatchSnapshot();
	});
});
