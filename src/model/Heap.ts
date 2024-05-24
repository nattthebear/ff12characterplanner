export class Heap<T> {
	private nodes: T[] = [];
	/** @param compare returns `true` if x should be removed before y */
	constructor(private compare: (x: T, y: T) => boolean) {}

	size() {
		return this.nodes.length;
	}

	insert(element: T) {
		const { nodes, compare } = this;
		let index = nodes.length;
		nodes.push(element);
		while (index > 0) {
			const parent = (index - 1) >> 1;
			if (!compare(nodes[index], nodes[parent])) {
				return;
			}
			const tmp = nodes[index];
			nodes[index] = nodes[parent];
			nodes[parent] = tmp;
			index = parent;
		}
	}

	remove() {
		const { nodes, compare } = this;
		if (nodes.length < 2) {
			return nodes.pop();
		}
		const oldRoot = nodes[0];
		const newRoot = nodes.pop()!;
		nodes[0] = newRoot;
		let index = 0;
		while (true) {
			const left = 2 * index + 1;
			const right = left + 1;
			let nextIndex = index;
			if (left < nodes.length && compare(nodes[left], newRoot)) {
				nextIndex = left;
			}
			if (right < nodes.length && compare(nodes[right], nodes[nextIndex])) {
				nextIndex = right;
			}
			if (nextIndex === index) {
				return oldRoot;
			}
			nodes[index] = nodes[nextIndex];
			nodes[nextIndex] = newRoot;
			index = nextIndex;
		}
	}
}
