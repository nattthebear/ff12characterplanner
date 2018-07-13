import * as React from "react";
import CharacterModel from "../model/CharacterModel";
import { Characters } from "../data/Characters";
import CharacterPlanner from "./CharacterPlanner";
import autobind from "../../node_modules/autobind-decorator";
import "normalize.css/normalize.css";
import "./App.scss";
import { Espers } from "../data/Licenses";

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
	private changeCharacter(newCharacter: CharacterModel, index: number) {
		const characters = this.state.characters.slice();
		characters[index] = newCharacter;
		// synchronize esper states
		const toBlock = Espers.filter(e => newCharacter.has(e));
		for (let i = 0; i < characters.length; i++) {
			if (i !== index) {
				for (const e of toBlock) {
					characters[i] = characters[i].block(e);
				}
			}
		}
		this.setState({ characters });
	}

	@autobind
	private changeIndices(characterIndex: number, boardIndex: number) {
		this.setState({ characterIndex, boardIndex });
	}

	render() {
		return <CharacterPlanner {...this.state} changeCharacter={this.changeCharacter} changeIndices={this.changeIndices} />;
	}
}
