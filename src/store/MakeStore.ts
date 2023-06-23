import { ComponentContext, scheduleUpdate, cleanup } from "vdomk";

export function makeStore<S>(initialValue: S) {
	let state = initialValue;
	const subs = new Set<() => void>();

	return {
		useStore(instance: ComponentContext) {
			const subscription = () => scheduleUpdate(instance);
			subs.add(subscription);
			cleanup(instance, () => {
				subs.delete(subscription);
			});
			return () => state;
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
