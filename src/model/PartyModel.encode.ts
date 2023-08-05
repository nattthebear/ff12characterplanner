import { Board, Boards } from "../data/Boards";
import { Characters } from "../data/Characters";
import { License } from "../data/Licenses";

// lookup tables for url encoding
interface UrlLookup {
	job1?: Board;
	job2?: Board;
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
			const v = { job1: a, job2: b };
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

function iterateLicenses(boards: Board[], c: number, has: (license: License) => boolean) {
	const lookupSets = boards.map(board => board.lookup);
	const toVisit = [...Characters[c].innateLicenses];
	const seen = new Set(toVisit);

	for (const license of toVisit) {
		for (const lookup of lookupSets) {
			const pos = lookup.get(license);
			if (pos) {
				for (const { value } of pos.adjacent) {
					if (!seen.has(value)) {
						seen.add(value);
						if (has(value)) {
							toVisit.push(value);
						}
					}
				}
			}
		}
	}
}

export function encodeCharacter(boards: Board[], licenses: Set<License>, c: number) {
	const idx = urlReverseLookup.get(boards[0])!.get(boards[1])!;
	const data = [idx];
	let bit = 1;
	let acc = 0;

	iterateLicenses(boards, c, license => {
		const has = licenses.has(license);
		if (has) {
			acc |= bit;
		}
		bit <<= 1;
		if (bit === 256) {
			data.push(acc);
			acc = 0;
			bit = 1;
		}
		return has;
	});

	if (bit !== 1) {
		data.push(acc);
	}
	while (data.length > 1 && data[data.length - 1] === 0) {
		data.pop();
	}
	return toBase64Url(String.fromCharCode(...data));
}

export function decodeCharacter(s: string, c: number) {
	s = fromBase64Url(s);
	const idx = s.charCodeAt(0) | 0;
	const mapping = urlLookup[idx];
	if (!mapping) {
		console.warn("Invalid tag id");
		return undefined;
	}

	const obtained = new Set<License>(Characters[c].innateLicenses);
	const jobs = [mapping.job1, mapping.job2].filter(j => j) as Board[]

	let b = 1;
	let i = 1;
	iterateLicenses(jobs, c, license => {
		const has = !!(s.charCodeAt(i) & b);
		b <<= 1;
		if (b === 256) {
			i++;
			b = 1;
		}
		if (has) {
			obtained.add(license);
		}
		return has;
	});

	return {
		jobs,
		licenses: obtained,
	};
}
