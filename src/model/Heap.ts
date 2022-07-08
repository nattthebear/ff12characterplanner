export class Heap<T> {
	private nodes: T[] = [];
	/** @param compare returns `true` if x should be removed before y */
	constructor(private compare: (x: T, y: T) => boolean) {}

	size() {
		return this.nodes.length;
	}

	insert(element: T) {
		let index = this.nodes.length;
		this.nodes.push(element);
		while (index > 0) {
			const parent = (index - 1) >> 1;
			if (!this.compare(this.nodes[index], this.nodes[parent])) {
				return;
			}
			const tmp = this.nodes[index];
			this.nodes[index] = this.nodes[parent];
			this.nodes[parent] = tmp;
			index = parent;
		}
	}

	remove() {
		if (this.nodes.length < 2) {
			return this.nodes.pop();
		}
		const oldRoot = this.nodes[0];
		const newRoot = this.nodes.pop()!;
		this.nodes[0] = newRoot;
		let index = 0;
		while (true) {
			const left = 2 * index + 1;
			const right = left + 1;
			let nextIndex = index;
			if (left < this.nodes.length && this.compare(this.nodes[left], newRoot)) {
				nextIndex = left;
			}
			if (right < this.nodes.length && this.compare(this.nodes[right], this.nodes[nextIndex])) {
				nextIndex = right;
			}
			if (nextIndex === index) {
				return oldRoot;
			}
			this.nodes[index] = this.nodes[nextIndex];
			this.nodes[nextIndex] = newRoot;
			index = nextIndex;
		}
	}
}
