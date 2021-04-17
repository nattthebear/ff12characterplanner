import { Characters } from "../data/Characters";
import { Board, Boards } from "../data/Boards";
import { License, Quickenings, Espers } from "../data/Licenses";
import { PriorityQueue } from "dz-priority-queue";

export enum Coloring {
	/** character has the license learned */
	OBTAINED,
	/** can be reached from obtained licenses without going through any not yet decided espers or quickenings */
	CERTAIN,
	/** can be reached from obtained and certain licenses, but requires going through a not yet decided esper or quickening */
	POSSIBLE,
	/** on the board, but not reachable without going through a blocked esper or quickening */
	BLOCKED
}

export interface ColorEx {
	/** every license discovered for this character by coloring */
	map: Map<License, Coloring>;
	/** every license OBTAINED in the map */
	obtained: Set<License>;
	/** every license CERTAIN in the map */
	certain: Set<License>;
	/** every license POSSIBLE in the map */
	possible: Set<License>;
	/** every license BLOCKED in the map */
	blocked: Set<License>;
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
		interface Path {
			nodes: License[];
			length: number;
		}
		function comparePaths(a: Path, b: Path) {
			return a.length < b.length;
		}
		const queue = new PriorityQueue<Path>([], comparePaths);
		const dests = new Map<License, Path>();
		for (const l of this.selected[c]) {
			for (const j of this.jobs[c]) {
				if (j.lookup.has(l)) {
					const path = {
						nodes: [l],
						length: 0
					};
					queue.push(path);
					dests.set(l, path);
					break;
				}
			}
		}
		while (queue.size()) {
			if (dests.has(to)) {
				return dests.get(to)!;
			}
			const p = queue.pop()!;
			const l = p.nodes[p.nodes.length - 1];
			for (const j of this.jobs[c]) {
				const location = j.lookup.get(l);
				if (location) {
					for (const next of location.adjacent.map(loc => loc.value).filter(val => val === to || !val.limited && !dests.has(val))) {
						const nextPath = {
							nodes: [...p.nodes, next],
							length: p.length + next.cost
						};
						queue.push(nextPath);
						dests.set(next, nextPath);
					}
				}
			}
		}
		return undefined;
	}

	private isBlocked(c: number, l: License) {
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
		for (const n of path.nodes) {
			r.selected[c].add(n);
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
		for (const { c, l } of toAdd) {
			const path = r.findPath(c, l);
			if (path) {
				for (const n of path.nodes) {
					r.selected[c].add(n);
				}
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

	private colorHelper(c: number, criteria: (l: License) => boolean, ...from: Set<License>[]) {
		const ret = new Set<License>();
		// const toCheck = from.flatMap(s => [...s]);
		const toCheck = Array<License>();
		for (const f of from) {
			toCheck.push(...f);
		}
		while (toCheck.length) {
			const l = toCheck.pop()!;
			for (const j of this.jobs[c]) {
				const cell = j.lookup.get(l);
				if (cell) {
					for (const p of cell.adjacent) {
						const { value } = p;
						if (from.every(f => !f.has(value)) && !ret.has(value) && criteria(value)) {
							ret.add(value);
							toCheck.push(value);
						}
					}
				}
			}
		}
		return ret;
	}

	colorEx(c: number): ColorEx {
		const obtained = this.selected[c];
		const certain = this.colorHelper(c, l => !l.limited, obtained);
		const possible = this.colorHelper(c, l => !this.blockedEspers.has(l) && (!Quickenings.includes(l) || this.quickeningCount[c] < 3), obtained, certain);
		const blocked = this.colorHelper(c, l => true, obtained, certain, possible);
		const ret = new Map<License, Coloring>();
		for (const l of obtained) {
			ret.set(l, Coloring.OBTAINED);
		}
		for (const l of certain) {
			ret.set(l, Coloring.CERTAIN);
		}
		for (const l of possible) {
			ret.set(l, Coloring.POSSIBLE);
		}
		for (const l of blocked) {
			ret.set(l, Coloring.BLOCKED);
		}
		return {
			map: ret,
			obtained,
			certain,
			possible,
			blocked
		};
	}

	color(c: number) {
		return this.colorEx(c).map;
	}

	encode() {
		let s = "";
		for (let c = 0; c < 6; c++) {
			s += encodeCharacter(this.jobs[c], this.selected[c]);
			if (c !== 5) {
				s += ".";
			}
		}
		return s;
	}

	static decode(s: string) {
		const ss = s.split(".");
		if (ss.length !== 6) {
			console.warn("Wrong number of segments");
			return undefined;
		}
		const cc = ss.map(decodeCharacter);
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

// lookup tables for url encoding
interface UrlLookup {
	job1?: Board;
	job2?: Board;
	licenses: License[];
}
function createUrlLookup() {
	const possibleJobs: (Board | undefined)[] = Boards.slice();
	possibleJobs.unshift(undefined);
	const ret = Array<UrlLookup>();
	for (const a of possibleJobs) {
		for (const b of possibleJobs) {
			if (a && a === b) {
				continue;
				// same job twice not valid unless it's undefined
			}
			const v = { job1: a, job2: b, licenses: Array<License>() };
			if (a) {
				for (const r of a.rows) {
					for (const p of r) {
						if (p) {
							v.licenses.push(p.value);
						}
					}
				}
			}
			if (b) {
				for (const r of b.rows) {
					for (const p of r) {
						if (p) {
							if (a && !a.lookup.has(p.value)) {
								v.licenses.push(p.value);
							}
						}
					}
				}
			}
			ret.push(v);
		}
	}
	const m = new Map<Board | undefined, Map<Board | undefined, number>>();
	for (let i = 0; i < ret.length; i++) {
		if (!m.has(ret[i].job1)) {
			m.set(ret[i].job1, new Map());
		}
		m.get(ret[i].job1)!.set(ret[i].job2, i);
	}
	return {
		urlLookup: ret,
		urlReverseLookup: m
	};
}
const { urlLookup, urlReverseLookup } = createUrlLookup();

function toBase64Url(s: string) {
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(s: string) {
	return atob(s.replace(/-/g, "+").replace(/_/g, "/"));
}

function encodeCharacter(boards: Board[], licenses: Set<License>) {
	const idx = urlReverseLookup.get(boards[0])!.get(boards[1])!;
	const mapping = urlLookup[idx];
	const n = [idx];
	let b = 1;
	let acc = 0;
	for (const l of mapping.licenses) {
		if (licenses.has(l)) {
			acc |= b;
		}
		b <<= 1;
		if (b === 256) {
			n.push(acc);
			acc = 0;
			b = 1;
		}
	}
	if (b !== 1) {
		n.push(acc);
	}
	return toBase64Url(String.fromCharCode(...n));
}

function decodeCharacter(s: string) {
	s = fromBase64Url(s);
	const idx = s.charCodeAt(0);
	const mapping = urlLookup[idx];
	if (!mapping) {
		console.warn("Invalid tag id");
		return undefined;
	}
	const ret = new Set<License>();
	let b = 1;
	let i = 1;
	for (const l of mapping.licenses) {
		if (s.charCodeAt(i) & b) {
			ret.add(l);
		}
		b <<= 1;
		if (b === 256) {
			i++;
			b = 1;
		}
	}
	return {
		jobs: [mapping.job1, mapping.job2].filter(j => j) as Board[],
		licenses: ret
	};
}

