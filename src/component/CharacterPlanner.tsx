import * as React from "react";
import CharacterModel from "../model/CharacterModel";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";

export interface Props {
	characters: CharacterModel[];
	characterIndex: number;
	boardIndex: number;
}

export default class CharacterPlanner extends React.PureComponent<Props> {
	render() {
		return <div className="character-planner">
			<CharacterPanel {...this.props} />
			<LicenseBoard character={this.props.characters[this.props.characterIndex]} index={this.props.boardIndex} />
		</div>;
	}
}
