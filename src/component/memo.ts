
const call = <T>(fn: () => T) => fn();

export type InputSelectors<T extends any[]> = { [K in keyof T]: () => T[K] };
export type Selector<T extends any[], R> = (...args: T) => R;

const { is } = Object;
function equal<T extends any[]>(x: T, y: T) {
	for (let i = 0; i < x.length; i++) {
		if (!is(x[i], y[i])) {
			return false;
		}
	}
	return true;
}

export function createSelector<T extends any[], R>(...args: [
	...inputSelectors: InputSelectors<T>, selector: Selector<T, R>
]) {
	const inputSelectors = args.slice(0, -1) as InputSelectors<T>;
	const selector = args.at(-1) as Selector<T, R>;

	let prevArgs: T | undefined;
	let prevResult: R;

	return function memoizedSelector() {
		const args = inputSelectors.map(call) as T;
		if (!prevArgs || !equal(prevArgs, args)) {
			prevArgs = args;
			prevResult = selector(...args);
		}
		return prevResult;
	}
}
