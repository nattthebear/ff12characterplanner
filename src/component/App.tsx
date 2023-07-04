import { h, TPC } from "vdomk";
import CharacterPlanner from "./CharacterPlanner";
import "modern-normalize/modern-normalize.css";
import "./App.css";
import { useStore } from "../store/Store";

const App: TPC<{}> = (_, instance) => {
	const getState = useStore(instance);

	return () => {
		const { party } = getState();
		requestIdleCallback(() => {
			const urlBase = window.location.href.split("?")[0];
			const search = party.encode();
			const urlSuffix = search === "AA.AA.AA.AA.AA.AA" ? "" : "?" + search;
			window.history.replaceState(null, "", urlBase + urlSuffix);
		});
		return <CharacterPlanner />;
	}
};

export default App;
