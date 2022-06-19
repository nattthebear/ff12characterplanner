import { useCallback, useEffect, useState } from "preact/hooks";

export function makeStore<S>(initialValue: S) {
	let state = initialValue;
	const subs = new Set<() => void>();

	return {
		useStore() {
			const updateSignal = useState(false)[1];

			useEffect(() => {
				function sub() {
					updateSignal(b => !b);
				}
				subs.add(sub);
				return () => {
					subs.delete(sub);
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
