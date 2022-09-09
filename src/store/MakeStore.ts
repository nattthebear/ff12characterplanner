import { useEffect, useReducer } from "preact/hooks";

export function makeStore<S>(initialValue: S) {
	let state = initialValue;
	const subs = new Set<() => void>();

	return {
		useStore() {
			const updateSignal = useReducer<number, void>(i => i + 1, 0)[1];

			useEffect(() => {
				subs.add(updateSignal);
				return () => {
					subs.delete(updateSignal);
				};
			}, []);
			return state;
		},
		dispatch(action: (s: S) => S) {
			// const when = performance.now();
			state = action(state);
			for (const sub of subs) {
				sub();
			}
			// Promise.resolve().then(() => console.log(`Synchronous portion of work from dispatch to end: ${performance.now() - when}ms`));
		},
	};
}
