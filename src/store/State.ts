import PartyModel from "../model/PartyModel.ts";
import { PS2Board } from "../data/Boards.ts";

export interface State {
	party: PartyModel;
	characterIndex: number;
	boardIndex: number;
	qeActive: boolean;
	dpsActive: boolean;
	/** Future party change.  Set by LicenseBoard in job select mode only, and used in CharacterPanel display */
	plannedParty: PartyModel | undefined;
	/** Keep the other edition's plan while switching the whole party. Session-only. */
	editionParties?: { tza?: PartyModel; ps2?: PartyModel };
}

export function makeInitialState(): State {
	const party = window.location.search && PartyModel.decode(window.location.search.slice(1));
	return {
		party: party || new PartyModel(),
		characterIndex: 0,
		boardIndex: 0,
		qeActive: false,
		dpsActive: false,
		plannedParty: undefined,
	};
}

export const changeParty = (party: PartyModel) => (s: State): State => {
	// don't allow selecting second job when first one is not learned
	if (s.boardIndex && !party.getJob(s.characterIndex, s.boardIndex)) {
		return { ...s, party, boardIndex: 0, plannedParty: undefined };
	} else {
		return { ...s, party, plannedParty: undefined };
	}
}

export const changeEdition = (edition: "tza" | "ps2") => (s: State): State => {
	const editionParties = { ...s.editionParties };
	if ([0, 1, 2, 3, 4, 5].some(c => s.party.isPS2(c))) editionParties.ps2 = s.party;
	if ([0, 1, 2, 3, 4, 5].some(c => !s.party.isPS2(c))) editionParties.tza = s.party;
	let party = editionParties[edition] ?? s.party;
	for (let c = 0; c < 6; c++) {
		if (edition === "ps2" && !party.isPS2(c)) {
			party = party.removeAllJobs(c).addJob(c, PS2Board);
		} else if (edition === "tza" && party.isPS2(c)) {
			party = party.removeAllJobs(c);
		}
	}
	return { ...s, party, editionParties, boardIndex: 0, plannedParty: undefined };
};

export const changeIndices = (characterIndex: number, boardIndex: number) => (s: State): State => {
	if (boardIndex && (!s.party.getJob(characterIndex, 0) || s.party.isPS2(characterIndex))) {
		// don't allow selecting second job when first one is not learned
		boardIndex = 0;
	}
	return { ...s, characterIndex, boardIndex };
}

export const toggleQe = () => (s: State): State =>
	s.qeActive
		? { ...s, qeActive: false }
		: { ...s, qeActive: true, dpsActive: false };


export const toggleDps = () => (s: State): State =>
	s.dpsActive
		? { ...s, dpsActive: false }
		: { ...s, dpsActive: true, qeActive: false };

export const changePlannedParty = (plannedParty: PartyModel | undefined) => (s: State): State => ({
	...s,
	plannedParty
});

