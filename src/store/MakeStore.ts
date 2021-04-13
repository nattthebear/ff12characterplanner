import { useCallback, useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

export function makeStore<S>(initialValue: S) {
	let state = initialValue;
	const subs = new Set<() => void>();

	return {
		useSelector<T>(project: (s: S) => T) {
			const value = project(state);
			const updateSignal = useState(false)[1];
			const prev = useRef(value);
			const sub = useCallback(() => {
				const newValue = project(state);
				if (newValue !== prev.current) {
					updateSignal(b => !b);
				}
			}, []);

			useEffect(() => {
				subs.add(sub);
				return () => {
					subs.delete(sub);
				};
			}, []);
			return value;
		},
		dispatch(action: (s: S) => S) {
			const newState = action(state);
			state = newState;
			unstable_batchedUpdates(() => {
				for (const sub of subs) {
					sub();
				}
			});
		},
	};
}
