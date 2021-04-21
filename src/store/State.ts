import PartyModel from "../model/PartyModel";

export interface State {
	party: PartyModel;
	characterIndex: number;
	boardIndex: number;
	qeActive: boolean;
	dpsActive: boolean;
	/** Future party change.  Set by LicenseBoard in job select mode only, and used in CharacterPanel display */
	plannedParty: PartyModel | undefined;
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

export const changeIndices = (characterIndex: number, boardIndex: number) => (s: State): State => {
	if (boardIndex && !s.party.getJob(characterIndex, 0)) {
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

