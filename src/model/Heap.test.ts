import { Heap } from "./Heap";

describe("Heap", () => {
	function cmp(a: number, b: number) {
		return a < b;
	}

	it('basic tests', () => {
		const h = new Heap(cmp);
		expect(h.size()).toBe(0);
		expect(h.remove()).toBe(undefined);
		h.insert(42);
		expect(h.size()).toBe(1);
		expect(h.remove()).toBe(42);
		expect(h.size()).toBe(0);
		h.insert(1);
		h.insert(7);
		h.insert(-13);
		expect(h.size()).toBe(3);
		expect(h.remove()).toBe(-13);
		expect(h.remove()).toBe(1);
		expect(h.remove()).toBe(7);
		expect(h.size()).toBe(0);
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
					expect((h as any).nodes[0]).toBe(mirror[mirror.length - 1]);
					expect(h.size()).toBe(mirror.length);
				} else {
					const v1 = h.remove();
					const v2 = mirror.pop();
					expect(v1).toBe(v2);
				}
			}
		}
	});
});
