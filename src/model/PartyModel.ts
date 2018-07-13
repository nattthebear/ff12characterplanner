import { Characters } from "../data/Characters";
import { Board, Boards } from "../data/Boards";
import { License, Quickenings, Espers } from "../data/Licenses";

export const enum Coloring {
	/** character has the license learned */
	OBTAINED,
	/** can be reached from obtained licenses without going through any not yet decided espers or quickenings */
	CERTAIN,
	/** can be reached from obtained and certain licenses, but requires going through a not yet decided esper or quickening */
	POSSIBLE,
	/** on the board, but not reachable without going through a blocked esper or quickening */
	BLOCKED
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
			for (const e of Espers) {
				if (sel.has(e)) {
					this.blockedEspers.add(e);
					for (let i = c + 1; i < 6; i++) {
						this.selected[i].delete(e);
					}
				}
			}
			let qc = Quickenings.filter(q => sel.has(q)).length;
			if (qc === 4) {
				qc--;
				sel.delete(Quickenings[3]);
			}
			this.quickeningCount[c] = qc;
			for (const l of Characters[c].innateLicenses) {
				sel.add(l);
			}

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
			this.selected[c] = reachable;	
		}
	}

	public getJob(c: number, index: number): Board | undefined {
		return this.jobs[c][index];
	}

	add(c: number, l: License) {
		if (this.selected[c].has(l) ||
			this.blockedEspers.has(l) ||
			Quickenings.includes(l) && this.quickeningCount[c] === 3
		) {
			return this;
		}
		const r = new PartyModel(this);
		r.selected[c].add(l);
		r.verify();
		if (!r.selected[c].has(l)) {
			return this;
		}
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

	public color(c: number) {
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
		return ret;
	}

	public encode() {
		let s = "";
		for (let c = 0; c < 6; c++) {
			s += encodeCharacter(this.jobs[c], this.selected[c]);
			if (c !== 5) {
				s += ".";
			}
		}
		return s;
	}

	public static decode(s: string) {
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
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=+$/, "");
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

/*
function encodeURL(str){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function decodeUrl(str){
    str = (str + '===').slice(0, str.length + (str.length % 4));
    return str.replace(/-/g, '+').replace(/_/g, '/');
}*/
