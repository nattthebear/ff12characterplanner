import { describe, snapshot } from "../../test/snapshots";
import { Boards } from "../data/Boards";
import { Licenses } from "../data/Licenses";
import PartyModel from "./PartyModel";

// A simple deterministic random number generator to provide for snapshot tests
class XorShift32 {
	private state: number;

	constructor(seed: number) {
		seed = seed | 0;
		if (!seed) {
			throw new Error("Seed must be non-zero");
		}
		this.state = seed;
	}

	next() {
		let x = this.state;
		x ^= x << 13;
		x ^= x >>> 17;
		x ^= x << 5;
		return (this.state = x) >>> 0;
	}
}

function doTest(r: XorShift32, count: number) {
	let p = new PartyModel();
	const c = r.next() % 6;
	p = p.addJob(c, Boards[r.next() % 12]);
	p = p.addJob(c, Boards[r.next() % 12]);
	const ll = Licenses.length;
	for (let i = 0; i < count; i++) {
		if (r.next() % 2) {
			p = p.delete(c, Licenses[r.next() % ll]);
		} else {
			p = p.add(c, Licenses[r.next() % ll]);
		}
	}
	return p.encode().split(".")[c];
}

describe("PartyModel", import.meta.url, it => {
	it("basic stress tests", () => {
		const r = new XorShift32(8675309);
		for (let i = 0; i < 200; i++) {
			snapshot(doTest(r, 2000));
		}
	});

	it("timed tests", () => {
		const r = new XorShift32(69420);
		const start = performance.now();
		for (let i = 0; i < 350; i++) {
			doTest(r, 1600);
		}
		snapshot(performance.now() - start);
	});
});
