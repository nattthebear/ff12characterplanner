import { Board, Boards } from "../data/Boards";
import { AllLimitedLicenses, License } from "../data/Licenses";
import PartyModel, { Coloring } from "./PartyModel";

function generateLicenseSet(characterIndex: number, boards: Board[], mist: License) {
	let party = new PartyModel();
	for (const board of boards) {
		party = party.addJob(characterIndex, board);
	}
	const oldColors = party.color(characterIndex);
	party = party.add(characterIndex, mist);
	const newColors = party.color(characterIndex);

	const ret: License[] = [];
	for (const [license, oldColor] of oldColors) {
		if (oldColor === Coloring.POSSIBLE) {
			const newColor = newColors.get(license);
			if (newColor === Coloring.CERTAIN) {
				ret.push(license);
			}
		}
	}
	return ret;
}

const coverCache: Map<string, Map<License, License[]>> = new Map;

function generateBoardSet(characterIndex: number, boards: Board[]) {
	const boardSet = new Map<License, License[]>();
	for (const mist of AllLimitedLicenses) {
		boardSet.set(mist, generateLicenseSet(characterIndex, boards, mist));
	}
	return boardSet;
}

function makeKey(characterIndex: number, boards: Board[]) {
	let key = boards[0].name;
	const b1Name = boards[1]?.name ?? "";
	if (b1Name < key) {
		key += b1Name;
	} else {
		key = b1Name + key;
	}
	key += characterIndex;
	return key;
}

/** Returns a mapping from mist licenses to the licenses behind them */
export function getCoverSet(characterIndex: number, boards: Board[]) {
	const key = makeKey(characterIndex, boards);
	let ret = coverCache.get(key);
	if (!ret) {
		ret = generateBoardSet(characterIndex, boards);
		coverCache.set(key, ret);
	}
	return ret;
}
