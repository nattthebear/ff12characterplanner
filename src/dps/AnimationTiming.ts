
import { AnimationClass } from "./Profile";

/** base speed, followed by combo variants, for each character */
const AttackFrames: {
	[K in AnimationClass]: number[][];
} = {
	//   Vaan          Balthier      Fran          Basch         Ashe          Penelope
	unarmed:
		[[36, 15, 23], [36, 15, 23], [36, 15, 32], [36, 20, 20], [36, 18, 18], [36, 26, 28]],
	sword:
		[[36, 15, 16], [36, 15, 15], [36, 18, 19], [36, 15, 15], [36, 18, 18], [36, 20, 20]],
	bigsword:
		[[36, 15, 15], [36, 15, 18], [36, 19, 19], [36, 15, 15], [36, 18, 20], [36, 20, 20]],
	dagger:
		[[36, 18, 23], [36, 15, 15], [36, 23, 23], [36, 15, 23], [36, 15, 15, 18], [36, 20, 23]],
	ninja:
		[[36, 15, 22], [36, 15, 15], [36, 19, 19], [36, 15, 15], [36, 15, 20], [36, 15, 15]],
	katana:
		[[36, 17, 18], [36, 15, 15], [36, 18, 19], [36, 15, 15], [36, 20, 20], [36, 18, 25]],
	hammer:
		[[36, 22, 23], [36, 18, 18], [36, 20, 21], [36, 15, 15], [36, 15, 18, 18], [36, 26, 26]],
	mace:
		[[36, 15, 15], [36, 23, 23], [36, 21, 23], [36, 15, 15], [36, 18, 20, 30], [36, 23, 23]],
	pole:
		[[36, 19, 19], [36, 19, 25], [36, 16, 17], [36, 18, 18], [36, 23, 28], [36, 20, 22]],
	spear:
		[[36, 18, 22], [36, 18, 18], [36, 17, 20], [36, 15, 20], [36, 17, 20], [36, 23, 28]],
	bow:
		[[42], [48], [48], [42], [42], [42]],
	xbow:
		[[42], [48], [42], [42], [42], [48]],
	gun:
		[[42], [48], [42], [42], [42], [48]],
	measure: // ??
		[[36], [36], [36], [36], [36], [36]],
	rod: // ??
		[[36, 18], [36, 18], [36, 18], [36, 18], [36, 18], [36, 18]],
	handbomb: // ??
		[[42], [42], [42], [42], [42], [42]],
	staff: // ??
		[[36, 18], [36, 18], [36, 18], [36, 18], [36, 18], [36, 18]],
};

export interface AnimationTiming {
	/** How long it takes to complete a single cycle of this weapon, in seconds. */
	initialSwing: number;
	/** How long it takes on average to add a single combo swing after an initial swing, in sections. */
	comboSwing: number;
}

function computeTiming(frames: number[]): AnimationTiming {
	const [initial, ...rest] = frames;
	return {
		initialSwing: initial / 30,
		comboSwing: rest.length ? rest.reduce((acc, val) => acc + val) / rest.length / 30 : 0,
	};
}

function mapValues<K extends string, V, O>(object: Record<K, V>, project: (v: V) => O): Record<K, O> {
	const ret: any = {};
	for (const k in object) {
		ret[k] = project(object[k]);
	}
	return ret;
}

export const AnimationTimings = mapValues(AttackFrames, arr => arr.map(computeTiming));
