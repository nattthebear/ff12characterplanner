// TODO: Verify these.  They were made by using the formula documented for classic with the stats on the wiki for izjs/tza
// Everything matches except Balthier's mag value?

const baseValues = {
	str: [23, 24, 23, 25, 21, 20, ],
	mag: [22, 18, 20, 20, 24, 21, ],
	vit: [24, 24, 26, 20, 23, 23, ],
	spd: [24, 24, 23, 23, 23, 24, ]
};

const modifiers = {
	str: [72, 67, 63, 69, 68, 65, ],
	mag: [67, 59, 63, 56, 70, 72, ],
	vit: [48, 45, 47, 36, 44, 48, ],
	spd: [18, 19, 18, 16, 17, 16, ]
};

/** Get the base stats for a character at a particular level */
export function BaseCharacterStats(characterIndex: number, characterLevel: number) {
	function f(base: number, modifier: number) {
		return Math.floor(characterLevel * modifier / 128) + base;
	}

	return {
		str: f(baseValues.str[characterIndex], modifiers.str[characterIndex]),
		mag: f(baseValues.mag[characterIndex], modifiers.mag[characterIndex]),
		vit: f(baseValues.vit[characterIndex], modifiers.vit[characterIndex]),
		spd: f(baseValues.spd[characterIndex], modifiers.spd[characterIndex]),		
	};
}
