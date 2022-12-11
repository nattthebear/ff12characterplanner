import { describe, it } from "node:test";
import * as assert from "node:assert/strict";

import { Heap } from "./Heap";

describe("Heap", () => {
	function cmp(a: number, b: number) {
		return a < b;
	}

	it('basic tests', () => {
		const h = new Heap(cmp);
		assert.equal(h.size(), 0);
		assert.equal(h.remove(), undefined);
		h.insert(42);
		assert.equal(h.size(), 1);
		assert.equal(h.remove(), 42);
		assert.equal(h.size(), 0);
		h.insert(1);
		h.insert(7);
		h.insert(-13);
		assert.equal(h.size(), 3);
		assert.equal(h.remove(), -13);
		assert.equal(h.remove(), 1);
		assert.equal(h.remove(), 7);
		assert.equal(h.size(), 0);
	});

	it('random tests', () => {
		function rnd(to: number) {
			return Math.floor(Math.random() * to);
		}
		for (let round = 0; round < 100; round++) {
			const h = new Heap(cmp);
			const mirror: number[] = [];
			for (let op = 0; op < 100; op++) {
				const action = rnd(3);
				if (action < 2) {
					const value = rnd(50);
					mirror.push(value);
					h.insert(value);
					mirror.sort((x, y) => y - x);
					assert.equal((h as any).nodes[0], mirror[mirror.length - 1]);
					assert.equal(h.size(), mirror.length);
				} else {
					const v1 = h.remove();
					const v2 = mirror.pop();
					assert.equal(v1, v2);
				}
			}
		}
	});
});
