import { h, TPC, effect, Fragment } from "vdomk";
import CharacterPlanner from "./CharacterPlanner";
import "modern-normalize/modern-normalize.css";
import "./App.css";
import { useStore } from "../store/Store";
import Tooltip from "../MouseOver";

const App: TPC<{}> = (_, instance) => {
	const getState = useStore(instance);

	return () => {
		const { party } = getState();
		effect(instance, () => {
			const urlBase = window.location.href.split("?")[0];
			const search = party.encode();
			const urlSuffix = search === "AA.AA.AA.AA.AA.AA" ? "" : "?" + search;
			window.history.replaceState(null, "", urlBase + urlSuffix);
		});
		return <>
			<CharacterPlanner />
			<Tooltip />
		</>;
	}
};

export default App;
