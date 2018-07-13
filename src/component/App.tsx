import * as React from "react";
import CharacterModel from "../model/CharacterModel";
import { Characters } from "../data/Characters";
import CharacterPlanner from "./CharacterPlanner";
import autobind from "../../node_modules/autobind-decorator";

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

	@autobind
	private changeCharacters(newCharacters: CharacterModel[]) {
		this.setState({ characters: newCharacters });
	}

	@autobind
	private changeIndices(characterIndex: number, boardIndex: number) {
		this.setState({ characterIndex, boardIndex });
	}

	render() {
		return <CharacterPlanner {...this.state} changeCharacters={this.changeCharacters} changeIndices={this.changeIndices} />;
	}
}
