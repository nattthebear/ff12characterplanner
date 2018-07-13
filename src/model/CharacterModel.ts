import { Character } from "../data/Characters";
import { Board } from "../data/Boards";
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

export default class CharacterModel {
	private character: Character;
	private classes: Board[] = [];
	private selected: Set<License>;
	private blocked = new Set<License>();

	public getCharacter() {
		return this.character;
	}
	public getClass(index: number): Board | undefined {
		return this.classes[index];
	}

	constructor(character: Character) {
		this.character = character;
		this.selected = new Set(character.innateLicenses);
	}

	clone() {
		const ret = new CharacterModel(this.character);
		ret.classes = this.classes.slice();
		ret.selected = new Set(this.selected);
		ret.blocked = new Set(this.blocked);
		return ret;
	}

	private computeQuickenings() {
		if (Quickenings.filter(q => this.selected.has(q)).length === 3) {
			for (const q of Quickenings) {
				if (!this.selected.has(q)) {
					this.blocked.add(q);
				}
			}
		} else {
			for (const q of Quickenings) {
				this.blocked.delete(q);
			}			
		}
	}

	private verify() {
		// after changing boards or deselecting, remove everything no longer reachable
		for (const l of this.blocked) {
			this.selected.delete(l);
		}
		for (const l of this.character.innateLicenses) {
			this.selected.add(l);
		}
		const reachable = new Set<License>();
		const toCheck = [...this.character.innateLicenses];
		while (toCheck.length) {
			const l = toCheck.pop()!;
			if (!reachable.has(l) && this.selected.has(l)) {
				reachable.add(l);
				for (const b of this.classes) {
					const cell = b.lookup.get(l);
					if (cell) {
						toCheck.push(...cell.adjacent.map(c => c.value));
					}
				}
			}
		}
		this.selected = reachable;
		this.computeQuickenings();
	}

	add(l: License) {
		if (this.selected.has(l) || this.blocked.has(l)) {
			return this;
		}
		const r = this.clone();
		r.selected.add(l);
		r.verify();
		if (!r.selected.has(l)) {
			return this;
		}
		return r;
	}

	delete(l: License) {
		if (!this.selected.has(l)) {
			return this;
		}
		const r = this.clone();
		r.selected.delete(l);
		r.verify();
		return r;
	}

	has(l: License) {
		return this.selected.has(l);
	}

	block(l: License) {
		if (!Espers.includes(l)) {
			throw new Error("Can only block espers");
		}
		if (this.blocked.has(l)) {
			return this;
		}
		const r = this.clone();
		r.blocked.add(l);
		r.verify();
		return r;
	}

	addClass(b: Board) {
		if (this.classes.includes(b)) {
			return this;
		}
		if (this.classes.length === 2) {
			return this;
		}
		const r = this.clone();
		r.classes.push(b);
		return r;
	}

	removeClass(b: Board) {
		if (!this.classes.includes(b)) {
			return this;
		}
		const r = this.clone();
		r.classes.splice(r.classes.indexOf(b), 1);
		r.verify();
		return r;
	}

	private colorHelper(criteria: (l: License) => boolean, ...from: Set<License>[]) {
		const ret = new Set<License>();
		// const toCheck = from.flatMap(s => [...s]);
		const toCheck = Array<License>();
		for (const f of from) {
			toCheck.push(...f);
		}
		while (toCheck.length) {
			const l = toCheck.pop()!;
			for (const b of this.classes) {
				const cell = b.lookup.get(l);
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

	public color() {
		const obtained = this.selected;
		const certain = this.colorHelper(l => !l.limited, obtained);
		const possible = this.colorHelper(l => !this.blocked.has(l), obtained, certain);
		const blocked = this.colorHelper(l => true, obtained, certain, possible);
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
}
