import * as React from "react";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import "./CharacterPlanner.scss";
import PartyModel from "../model/PartyModel";

export interface Props {
	party: PartyModel;
	changeParty(newParty: PartyModel): void;
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
}

export default class CharacterPlanner extends React.PureComponent<Props> {
	render() {
		return <div className="character-planner">
			<CharacterPanel {...this.props} />
			<LicenseBoard {...this.props} />
		</div>;
	}
}
