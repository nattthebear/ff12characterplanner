// This exists in its own file primarily to mock it out for Jest tests.

/** Yield processing until others have had a chance to catch up. */
export function turn() {
	return new Promise<void>(r => window.setTimeout(r, 0));
}

export function markTime() {
	return performance.now();
}

export function shouldTurn(time: number) {
	return performance.now() - time > 50;
}
