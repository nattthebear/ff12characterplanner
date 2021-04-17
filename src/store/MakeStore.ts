import { useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

export function makeStore<S>(initialValue: S) {
	let state = initialValue;
	const subs = new Set<() => void>();

	return {
		useStore() {
			const updateSignal = useState(false)[1];
			const sub = useCallback(() => {
				updateSignal(b => !b);
			}, []);

			useEffect(() => {
				subs.add(sub);
				return () => {
					subs.delete(sub);
				};
			}, []);
			return state;
		},
		dispatch(action: (s: S) => S) {
			state = action(state);
			unstable_batchedUpdates(() => {
				for (const sub of subs) {
					sub();
				}
			});
		},
	};
}
