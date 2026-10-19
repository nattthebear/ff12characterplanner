// Original PS2 base / growth values: Game Mechanics FAQ section 6a.
const base = {
	str: [23, 24, 22, 25, 21, 20],
	mag: [20, 17, 18, 20, 21, 18],
	vit: [24, 24, 20, 20, 23, 23],
	spd: [24, 24, 23, 23, 23, 24],
};
const growth = {
	str: [70, 67, 64, 68, 68, 65],
	mag: [57, 51, 54, 50, 63, 66],
	vit: [48, 45, 43, 36, 44, 48],
	spd: [18, 19, 18, 16, 17, 16],
};

export function BaseCharacterStats(character: number, level: number) {
	const stat = (key: keyof typeof base) => base[key][character] + Math.floor(level * growth[key][character] / 128);
	return { str: stat("str"), mag: stat("mag"), vit: stat("vit"), spd: stat("spd") };
}
