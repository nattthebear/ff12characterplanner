import { Characters } from "../data/Characters";
import { Board } from "../data/Boards";
import { License, Quickenings, Espers } from "../data/Licenses";
import { Heap } from "./Heap";
import { getCoverSet } from "./Adjacency";
import { decodeCharacter, encodeCharacter } from "./PartyModel.encode";

export enum Coloring {
	/** character has the license learned */
	OBTAINED,
	/** can be reached from obtained licenses without going through any not yet decided espers or quickenings */
	CERTAIN,
	/** can be reached from obtained and certain licenses, but requires going through a not yet decided esper or quickening */
	POSSIBLE,
}

interface Path {
	node: License;
	prev: Path | null
	length: number;
}

export default class PartyModel {
	private jobs: Board[][];
	private selected: Set<License>[];
	private blockedEspers = new Set<License>();
	private quickeningCount: number[];

	constructor(source?: PartyModel) {
		if (source) {
			this.jobs = source.jobs.map(cc => cc.slice());
			this.selected = source.selected.map(s => new Set(s));
			this.blockedEspers = new Set(source.blockedEspers);
			this.quickeningCount = source.quickeningCount.slice();
		} else {
			this.jobs = Characters.map(c => []);
			this.selected = Characters.map(c => new Set());
			this.blockedEspers = new Set();
			this.quickeningCount = Characters.map(c => 0);
			this.verify();
		}
	}

	private verify() {
		this.blockedEspers.clear();
		for (let c = 0; c < 6; c++) {
			const sel = this.selected[c];

			// prune any espers assigned twice
			for (const e of Espers) {
				if (sel.has(e)) {
					for (let i = c + 1; i < 6; i++) {
						this.selected[i].delete(e);
					}
				}
			}

			// prune extra quickenings
			if (Quickenings.filter(q => sel.has(q)).length === 4) {
				sel.delete(Quickenings[3]);
			}

			// force any innate license to be taken
			for (const l of Characters[c].innateLicenses) {
				sel.add(l);
			}

			// prune any license that's not reachable from starting (innate) licenses
			const reachable = new Set<License>();
			const toCheck = [...Characters[c].innateLicenses];
			while (toCheck.length) {
				const l = toCheck.pop()!;
				if (!reachable.has(l) && sel.has(l)) {
					reachable.add(l);
					for (const j of this.jobs[c]) {
						const cell = j.lookup.get(l);
						if (cell) {
							toCheck.push(...cell.adjacent.map(p => p.value));
						}
					}
				}
			}

			// compute esper and quickening counts at the end, in case the prune operation removed additional ones
			for (const e of Espers) {
				if (reachable.has(e)) {
					this.blockedEspers.add(e);
				}
			}
			this.quickeningCount[c] = Quickenings.filter(q => reachable.has(q)).length;

			this.selected[c] = reachable;
		}
	}

	getJob(c: number, index: number): Board | undefined {
		return this.jobs[c][index];
	}

	unemployed(c: number) {
		return this.jobs[c].length === 0;
	}

	allUnemployed() {
		return !this.jobs.find(a => a.length > 0);
	}

	getLpCount(c: number) {
		let lp = 0;
		for (const l of this.selected[c]) {
			if (!Characters[c].innateLicenses.includes(l)) {
				lp += l.cost;
			}
		}
		return lp;
	}

	/** Find the shortest path to a license */
	private findPath(c: number, to: License) {
		function comparePaths(a: Path, b: Path) {
			return a.length < b.length;
		}
		const queue = new Heap(comparePaths);
		const dests = new Map<License, Path>();
		for (const l of this.selected[c]) {
			for (const j of this.jobs[c]) {
				if (j.lookup.has(l)) {
					const path = {
						node: l,
						prev: null,
						length: 0,
					};
					queue.insert(path);
					dests.set(l, path);
					break;
				}
			}
		}
		while (queue.size()) {
			if (dests.has(to)) {
				return dests.get(to)!;
			}
			const p = queue.remove()!;
			const l = p.node;
			for (const j of this.jobs[c]) {
				const location = j.lookup.get(l);
				if (location) {
					for (const nextLocation of location.adjacent) {
						const next = nextLocation.value;
						if (next !== to && next.limited || dests.has(next)) {
							continue;
						}
						const nextPath = {
							node: next,
							prev: p,
							length: p.length + next.cost,
						};
						queue.insert(nextPath);
						dests.set(next, nextPath);
					}
				}
			}
		}
		return null;
	}

	/**
	 * @param c character index
	 * @param l a mist license that c has not obtained
	 * @returns true if the license cannot be obtained due to mist constraints
	 */
	isBlocked(c: number, l: License) {
		return this.blockedEspers.has(l) || Quickenings.includes(l) && this.quickeningCount[c] === 3;
	}

	add(c: number, l: License) {
		if (this.selected[c].has(l) || this.isBlocked(c, l)) {
			return this;
		}
		const path = this.findPath(c, l);
		if (!path) {
			return this;
		}
		const r = new PartyModel(this);
		for (let curr: Path | null = path; curr; curr = curr.prev) {
			r.selected[c].add(curr.node);
		}
		r.verify();
		return r;
	}

	delete(c: number, l: License) {
		if (!this.selected[c].has(l)) {
			return this;
		}
		const r = new PartyModel(this);
		r.selected[c].delete(l);
		r.verify();
		return r;
	}

	deleteAndAdd(toDelete: { c: number, l: License}[], toAdd: { c: number, l: License }[]) {
		const r = new PartyModel(this);
		for (const { c, l } of toDelete) {
			r.selected[c].delete(l);
		}
		r.verify();
		for (const { c, l } of toAdd) {
			const path = r.findPath(c, l);
			for (let curr: Path | null = path; curr; curr = curr.prev) {
				r.selected[c].add(curr.node);
			}
		}
		r.verify();
		return r;
	}

	has(c: number, l: License) {
		return this.selected[c].has(l);
	}

	addJob(c: number, j: Board) {
		if (this.jobs[c].includes(j)) {
			return this;
		}
		if (this.jobs[c].length === 2) {
			return this;
		}
		const r = new PartyModel(this);
		r.jobs[c].push(j);
		return r;
	}

	removeJob(c: number, j: Board) {
		if (!this.jobs[c].includes(j)) {
			return this;
		}
		const r = new PartyModel(this);
		r.jobs[c].splice(r.jobs[c].indexOf(j), 1);
		r.verify();
		return r;
	}

	removeAllJobs(c: number) {
		if (!this.jobs[c].length) {
			return this;
		}
		const r = new PartyModel(this);
		r.jobs[c].length = 0;
		r.verify();
		return r;
	}

	/** Returns a mapping from mist licenses to the licenses behind them */
	getCovered(c: number) {
		return getCoverSet(c, this.jobs[c]);
	}

	color(c: number) {
		const ret = new Map<License, Coloring>();
		for (const l of this.selected[c]) {
			ret.set(l, Coloring.OBTAINED);
		}

		const colorHelper = (criteria: (l: License) => boolean, color: Coloring) => {
			for (const l of ret.keys()) {
				for (const j of this.jobs[c]) {
					const cell = j.lookup.get(l);
					if (!cell) {
						continue;
					}
					for (const { value } of cell.adjacent) {
						if (!ret.has(value) && criteria(value)) {
							ret.set(value, color);
						}
					}
				}
			}
		}
		colorHelper(l => !l.limited, Coloring.CERTAIN);
		colorHelper(l => !this.isBlocked(c, l), Coloring.POSSIBLE);

		return ret;
	}

	encode() {
		let queryString = "";
		for (let c = 0; c < 6; c++) {
			queryString += encodeCharacter(this.jobs[c], this.selected[c], c);
			if (c !== 5) {
				queryString += ".";
			}
		}
		return queryString;
	}

	static decode(queryString: string) {
		const queryParts = queryString.split(".");
		const cc = queryParts.map(decodeCharacter);
		const ret = new PartyModel();
		for (let c = 0; c < 6; c++) {
			const decoded = cc[c];
			if (decoded) {
				ret.jobs[c] = decoded.jobs;
				ret.selected[c] = decoded.licenses;
			}
		}
		ret.verify();
		return ret;
	}
}
