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

async function doTest({ character, job, job2, licenses, env }: TestParameters) {
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
	for await (const result of optimizeForCharacter(e, party)) {
		results.push(result);
	}
	return results.filter(r => r.dps.dps > 0)
		.sort((a, b) => b.dps.dps - a.dps.dps)
		.map(resultToSnapshottable);
}

async function timeTest(pp: TestParameters) {
	const start = performance.now();
	for (let i = 0; i < 35; i++) {
		await doTest(pp);
	}
	return performance.now();
}



describe("OptimizeForCharacter", () => {
	it("basic test", async () => {
		expect(await doTest({
			character: Character.Vaan, job: Job.Knight, job2: Job.Bushi,
		})).toMatchSnapshot();
		expect(await doTest({
			character: Character.Basch, job: Job.Foebreaker, job2: Job.Bushi,
		})).toMatchSnapshot();
		expect(await doTest({
			character: Character.Balthier, job: Job.Shikari, job2: Job.Bushi,
			licenses: ["Quickening 2", "Quickening 3", "Quickening 4", "Zodiark"]
		})).toMatchSnapshot();
		expect(await doTest({
			character: Character.Vaan, job: Job.Monk, job2: Job.Archer,
			licenses: ["Shemhazai"]
		})).toMatchSnapshot();
		expect(await doTest({
			character: Character.Fran, job: Job.Monk, job2: Job.Foebreaker,
		})).toMatchSnapshot();
	});

	it("something brawler", async () => {
		expect(await doTest({
			character: Character.Penelo,
			job: Job.Knight,
			env: {
				level: 53,
				def: 40
			}
		})).toMatchSnapshot();
	});

	it("Perf tests", async () => {
		const t1 = await timeTest({ character: Character.Basch, job: Job.Knight, job2: Job.Foebreaker });
		const t2 = await timeTest({ character: Character.Basch, job: Job.Bushi, job2: Job.WhiteMage });
		expect ([t1, t2]).toMatchSnapshot();
	});
});
