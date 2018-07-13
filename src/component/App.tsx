import * as React from "react";
import CharacterModel from "../model/CharacterModel";
import { Characters } from "../data/Characters";
import CharacterPlanner from "./CharacterPlanner";

export interface State {
	characters: CharacterModel[];
	characterIndex: number;
	boardIndex: number;
}

export default class App extends React.PureComponent<{}, State> {
	state: State = {
		characters: Characters.map(c => new CharacterModel(c)),
		characterIndex: 0,
		boardIndex: 0
	};

	render() {
		return <CharacterPlanner {...this.state} />;
	}
}
