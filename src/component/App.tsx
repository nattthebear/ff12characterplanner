import { h } from "preact";
import CharacterPlanner from "./CharacterPlanner";
import "normalize.css/normalize.css";
import "./App.css";
import { useStore } from "../store/Store";
import { useEffect } from "preact/hooks";

export default function App() {
	const { party } = useStore();
	useEffect(() => {
		const urlBase = window.location.href.split("?")[0];
		const search = party.encode();
		const urlSuffix = search === "AA.AA.AA.AA.AA.AA" ? "" : "?" + search;
		window.history.replaceState(null, "", urlBase + urlSuffix);
	}, [party]);

	return <CharacterPlanner />;
}
