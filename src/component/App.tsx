import * as React from "react";
import CharacterPlanner from "./CharacterPlanner";
import "normalize.css/normalize.css";
import "./App.scss";
import { useSelector } from "../store/Store";
import { useEffect } from "react";

export default function App() {
	const party = useSelector(s => s.party);
	useEffect(() => {
		window.history.replaceState(null, "", window.location.href.split("?")[0] + "?" + party.encode());
	}, [party]);

	return <CharacterPlanner />;
}
