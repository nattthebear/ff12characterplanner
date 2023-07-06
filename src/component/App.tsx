import { h, TPC } from "vdomk";
import CharacterPlanner from "./CharacterPlanner";
import "modern-normalize/modern-normalize.css";
import "./App.css";
import { useStore } from "../store/Store";
import PartyModel from "../model/PartyModel";

const App: TPC<{}> = (_, instance) => {
	const getState = useStore(instance);
	let prevParty: PartyModel | undefined;

	return () => {
		const { party } = getState();
		if (party !== prevParty) {
			requestIdleCallback(() => {
				const urlBase = window.location.href.split("?")[0];
				const search = party.encode();
				const urlSuffix = search === "AA.AA.AA.AA.AA.AA" ? "" : "?" + search;
				window.history.replaceState(null, "", urlBase + urlSuffix);
			});
			prevParty = party;
		}
		return <CharacterPlanner />;
	}
};

export default App;
