import * as React from "react";
import CharacterModel from "../model/CharacterModel";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import autobind from "autobind-decorator";

export interface Props {
	characters: CharacterModel[];
	changeCharacters(newCharacters: CharacterModel[]): void;
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
}

export default class CharacterPlanner extends React.PureComponent<Props> {
	@autobind
	private changeCharacter(newCharacter: CharacterModel) {
		const newCharacters = this.props.characters.slice();
		newCharacters[this.props.characterIndex] = newCharacter;
		this.props.changeCharacters(newCharacters);
	}

	render() {
		return <div className="character-planner">
			<CharacterPanel {...this.props} />
			<LicenseBoard character={this.props.characters[this.props.characterIndex]} index={this.props.boardIndex} changeCharacter={this.changeCharacter} />
		</div>;
	}
}
